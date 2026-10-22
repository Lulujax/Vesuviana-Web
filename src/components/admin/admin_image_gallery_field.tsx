import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Link2, Loader2, Upload, X } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMAGE_RECOMMENDATIONS } from "@/core/constants/vesuviana_constants";
import {
  adapt_image_file,
  inspect_remote_image,
  is_supported_image_file
} from "@/core/services/image_adaptation_service";
import type { ImageAdaptationWarning } from "@/core/types/vesuviana_domain_types";
import { normalize_admin_error } from "@/components/admin/admin_error";
import { cn } from "@/lib/utils";

interface AdminImageGalleryFieldProps {
  value: string[];
  on_change: (next_value: string[]) => void;
  error?: string;
  maximum_images?: number;
}

const warning_tone_classes = {
  success: "border-success/25 bg-success/8 text-success",
  info: "border-gold/25 bg-gold/8 text-gold-deep",
  warning: "border-danger/20 bg-danger/8 text-danger"
} as const;

export function AdminImageGalleryField({ value, on_change, error, maximum_images = 4 }: AdminImageGalleryFieldProps) {
  const recommendation = IMAGE_RECOMMENDATIONS.product;
  const file_input_ref = useRef<HTMLInputElement>(null);
  const [url_draft, set_url_draft] = useState("");
  const [warning, set_warning] = useState<ImageAdaptationWarning | null>(null);
  const [local_error, set_local_error] = useState("");
  const [is_processing, set_is_processing] = useState(false);
  const is_at_limit = value.length >= maximum_images;

  const append_image = (image_url: string) => {
    if (value.includes(image_url)) {
      set_local_error("Esa imagen ya está en la galería.");
      return;
    }
    on_change([...value, image_url]);
  };

  const add_remote_url = async () => {
    set_local_error("");
    if (is_at_limit) {
      set_local_error(`Puedes agregar hasta ${maximum_images} imágenes.`);
      return;
    }
    if (!url_draft.trim()) {
      set_local_error("Ingresa una URL de imagen.");
      return;
    }
    set_is_processing(true);
    try {
      const result = await inspect_remote_image(url_draft, "product");
      append_image(result.image_url);
      set_warning(result.warning);
      set_url_draft("");
    } catch (caught_error) {
      set_local_error(normalize_admin_error(caught_error).message);
    } finally {
      set_is_processing(false);
    }
  };

  const handle_file_change = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected_file = event.target.files?.[0];
    event.target.value = "";
    if (!selected_file) {
      return;
    }
    set_local_error("");
    if (is_at_limit) {
      set_local_error(`Puedes agregar hasta ${maximum_images} imágenes.`);
      return;
    }
    if (!is_supported_image_file(selected_file)) {
      set_local_error("Usa una imagen JPG, PNG, WEBP o AVIF.");
      return;
    }
    set_is_processing(true);
    try {
      const result = await adapt_image_file(selected_file, "product");
      append_image(result.image_url);
      set_warning(result.warning);
    } catch (caught_error) {
      set_local_error(normalize_admin_error(caught_error).message);
    } finally {
      set_is_processing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">Fotografías del producto</span>
        <span className="text-[0.64rem] text-stone">
          {value.length}/{maximum_images} · {recommendation.width} × {recommendation.height} px
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {value.map((image_url, image_index) => (
          <div key={`${image_url.slice(0, 48)}-${image_index}`} className="relative aspect-square overflow-hidden rounded-xl border border-line bg-sand">
            <ImageWithFallback
              src={image_url}
              alt={`Imagen ${image_index + 1} del producto`}
              className="size-full"
              sizes="10rem"
            />
            <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[0.55rem] text-cream backdrop-blur">
              {image_index === 0 ? "Principal" : `0${image_index + 1}`}
            </span>
            <button
              type="button"
              onClick={() => on_change(value.filter((_, current_index) => current_index !== image_index))}
              aria-label={`Quitar imagen ${image_index + 1}`}
              className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-ink/75 text-cream backdrop-blur transition-colors hover:bg-danger"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length < maximum_images ? (
          <button
            type="button"
            onClick={() => file_input_ref.current?.click()}
            disabled={is_processing}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-sand/30 text-stone transition-colors hover:border-gold/50 hover:text-gold-deep"
          >
            {is_processing ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            <span className="text-[0.65rem]">Agregar</span>
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone/60" />
          <Input
            value={url_draft}
            onChange={(event) => set_url_draft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void add_remote_url();
              }
            }}
            placeholder="Pega una URL de imagen"
            className="h-10 rounded-lg pl-9 text-[0.78rem]"
            aria-label="URL de fotografía del producto"
          />
        </div>
        <input
          ref={file_input_ref}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => void handle_file_change(event)}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => void add_remote_url()} disabled={is_processing || is_at_limit}>
          Usar URL
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => file_input_ref.current?.click()}
          disabled={is_processing || is_at_limit}
        >
          <Upload className="size-3.5" />
          Subir
        </Button>
      </div>

      {local_error || error ? <p className="text-[0.72rem] leading-relaxed text-danger">{local_error || error}</p> : null}
      {warning ? (
        <div className={cn("rounded-lg border px-3 py-2 text-[0.7rem] leading-relaxed", warning_tone_classes[warning.severity])}>
          {warning.message}
        </div>
      ) : null}
    </div>
  );
}
