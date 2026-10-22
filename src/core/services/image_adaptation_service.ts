import type {
  ImageAdaptationWarning,
  ImageAssetKind,
  ImageInspectionResult
} from "@/core/types/vesuviana_domain_types";
import { IMAGE_RECOMMENDATIONS } from "@/core/constants/vesuviana_constants";
import { VesuvianaImageProcessingException } from "@/core/exceptions/vesuviana_domain_exceptions";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAXIMUM_FILE_SIZE_BYTES = 15 * 1024 * 1024;

const load_image_element = (source_url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image_element = new Image();
    image_element.decoding = "async";
    image_element.onload = () => resolve(image_element);
    image_element.onerror = () => reject(new VesuvianaImageProcessingException("No pudimos cargar la imagen seleccionada."));
    image_element.src = source_url;
  });

const build_warning = (
  detected_width: number,
  detected_height: number,
  output_width: number,
  output_height: number,
  asset_kind: ImageAssetKind
): ImageAdaptationWarning => {
  const recommendation = IMAGE_RECOMMENDATIONS[asset_kind];
  const is_below_recommended =
    detected_width < recommendation.width || detected_height < recommendation.height;
  const detected_ratio = detected_width / detected_height;
  const ratio_difference = Math.abs(detected_ratio - recommendation.aspect_ratio) / recommendation.aspect_ratio;
  const was_cropped = ratio_difference > 0.02;
  const was_downscaled = detected_width > output_width || detected_height > output_height;
  const severity = is_below_recommended || was_cropped ? (is_below_recommended ? "warning" : "info") : "success";
  let message = "";
  if (severity === "success") {
    message = `Resolución óptima detectada: ${detected_width} × ${detected_height} px. La imagen se adapta sin estiramientos.`;
  } else if (is_below_recommended) {
    message = `Detectamos ${detected_width} × ${detected_height} px. La recomendación para ${recommendation.label.toLowerCase()} es ${recommendation.width} × ${recommendation.height} px. La imagen se adaptó sin estirarse con recorte inteligente.`;
  } else {
    message = `Detectamos ${detected_width} × ${detected_height} px. La imagen se recortó de forma centrada para el formato ${recommendation.width} × ${recommendation.height} px. Para evitar recortes, usa la proporción recomendada.`;
  }
  return {
    detected_width,
    detected_height,
    recommended_width: recommendation.width,
    recommended_height: recommendation.height,
    output_width,
    output_height,
    was_cropped,
    was_downscaled,
    message,
    severity
  };
};

export function is_image_data_url(value: string): boolean {
  return /^data:image\//i.test(value.trim());
}

export function is_supported_image_file(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
}

export async function inspect_remote_image(
  image_url: string,
  asset_kind: ImageAssetKind
): Promise<ImageInspectionResult> {
  const trimmed_url = image_url.trim();
  if (!trimmed_url) {
    throw new VesuvianaImageProcessingException("Ingresa una URL de imagen.");
  }
  if (!/^https?:\/\//i.test(trimmed_url) && !is_image_data_url(trimmed_url)) {
    throw new VesuvianaImageProcessingException("La URL debe comenzar con http:// o https://.");
  }
  const image_element = await load_image_element(trimmed_url);
  const detected_width = image_element.naturalWidth;
  const detected_height = image_element.naturalHeight;
  if (!detected_width || !detected_height) {
    throw new VesuvianaImageProcessingException("La imagen no reportó dimensiones válidas.");
  }
  return {
    image_url: trimmed_url,
    detected_width,
    detected_height,
    is_data_url: is_image_data_url(trimmed_url),
    warning: build_warning(detected_width, detected_height, detected_width, detected_height, asset_kind)
  };
}

export async function adapt_image_file(file: File, asset_kind: ImageAssetKind): Promise<ImageInspectionResult> {
  if (!is_supported_image_file(file)) {
    throw new VesuvianaImageProcessingException("Usa una imagen JPG, PNG, WEBP o AVIF.");
  }
  if (file.size > MAXIMUM_FILE_SIZE_BYTES) {
    throw new VesuvianaImageProcessingException("La imagen supera el límite de 15 MB. Elige un archivo más ligero.");
  }
  const object_url = URL.createObjectURL(file);
  try {
    const image_element = await load_image_element(object_url);
    const detected_width = image_element.naturalWidth;
    const detected_height = image_element.naturalHeight;
    if (!detected_width || !detected_height) {
      throw new VesuvianaImageProcessingException("La imagen no reportó dimensiones válidas.");
    }
    const recommendation = IMAGE_RECOMMENDATIONS[asset_kind];
    let crop_width = detected_width;
    let crop_height = detected_height;
    const source_ratio = detected_width / detected_height;
    if (source_ratio > recommendation.aspect_ratio) {
      crop_width = Math.round(detected_height * recommendation.aspect_ratio);
    } else {
      crop_height = Math.round(detected_width / recommendation.aspect_ratio);
    }
    const source_x = Math.round((detected_width - crop_width) / 2);
    const source_y = Math.round((detected_height - crop_height) / 2);
    const output_width = Math.max(1, Math.min(crop_width, recommendation.width));
    const output_height = Math.max(1, Math.round(output_width / recommendation.aspect_ratio));
    const canvas_element = document.createElement("canvas");
    canvas_element.width = output_width;
    canvas_element.height = output_height;
    const context = canvas_element.getContext("2d");
    if (!context) {
      throw new VesuvianaImageProcessingException("El navegador no pudo procesar la imagen.");
    }
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, output_width, output_height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image_element,
      source_x,
      source_y,
      crop_width,
      crop_height,
      0,
      0,
      output_width,
      output_height
    );
    const adapted_url = canvas_element.toDataURL("image/webp", 0.84);
    return {
      image_url: adapted_url,
      detected_width,
      detected_height,
      is_data_url: true,
      warning: build_warning(detected_width, detected_height, output_width, output_height, asset_kind)
    };
  } finally {
    URL.revokeObjectURL(object_url);
  }
}
