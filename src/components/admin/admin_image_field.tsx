import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Link2, Loader2, Upload, X } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMAGE_RECOMMENDATIONS } from "@/core/constants/vesuviana_constants";
import {
  adapt_image_file,
  inspect_remote_image,
  is_image_data_url,
  is_supported_image_file
} from "@/core/services/image_adaptation_service";
import type { ImageAdaptationWarning, ImageAssetKind } from "@/core/types/vesuviana_domain_types";
import { normalize_admin_error } from "@/components/admin/admin_error";
import { cn } from "@/lib/utils";

interface AdminImageFieldProps {
  asset_kind: ImageAssetKind;
  value: string;
  on_change: (next_value: string) => void;
  error?: string;
  label: string;
}

const warning_tone_classes = {
  success: "border-success/25 bg-success/8 text-success",
  info: "border-gold/25 bg-gold/8 text-gold-deep",
  warning: "border-danger/20 bg-danger/8 text-danger"
} as const;

export function AdminImageField({ asset_kind, value, on_change, error, label }: AdminImageFieldProps) {
  const recommendation = IMAGE_RECOMMENDATIONS[asset_kind];
  const file_input_ref = useRef<HTMLInputElement>(null);
  const [url_draft, set_url_draft] = useState(value.startsWith("http") ? value : "");
  const [warning, set_warning] = useState<ImageAdaptationWarning | null>(null);
  const [local_error, set_local_error] = useState("");
  const [is_processing, set_is_processing] = useState(false);
  const aspect_class = asset_kind === "slide" ? "aspect-video" : "aspect-square";

  const apply_remote_url = async () => {
    set_local_error("");
    if (!url_draft.trim()) {
      set_local_error("Ingresa una URL de imagen.");
      return;
    }
    set_is_processing(true);
    try {
      const result = await inspect_remote_image(url_draft, asset_kind);
      on_change(result.image_url);
      set_warning(result.warning);
      set_url_draft(result.image_url);
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
    if (!is_supported_image_file(selected_file)) {
      set_local_error("Usa una imagen JPG, PNG, WEBP o AVIF.");
      return;
    }
    set_is_processing(true);
    try {
      const result = await adapt_image_file(selected_file, asset_kind);
      on_change(result.image_url);
      set_warning(result.warning);
      set_url_draft("");
    } catch (caught_error) {
      set_local_error(normalize_admin_error(caught_error).message);
    } finally {
      set_is_processing(false);
    }
  };

  const clear_image = () => {
    on_change("");
    set_url_draft("");
    set_warning(null);
    set_local_error("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">{label}</span>
        <span className="text-[0.64rem] text-stone">
          Recomendado: {recommendation.width} × {recommendation.height} px
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[13rem_1fr]">
        <div className={cn("relative overflow-hidden rounded-xl border border-line bg-sand", aspect_class)}>
          {value ? (
            <>
              <ImageWithFallback src={value} alt="Vista previa de imagen" className="size-full" sizes="13rem" />
              <button
                type="button"
                onClick={clear_image}
                aria-label="Quitar imagen"
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-ink/75 text-cream backdrop-blur transition-colors hover:bg-danger"
              >
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => file_input_ref.current?.click()}
              className="flex size-full flex-col items-center justify-center gap-2 text-stone transition-colors hover:text-gold-deep"
            >
              <ImagePlus className="size-6" />
              <span className="text-[0.65rem]">Sin imagen</span>
            </button>
          )}
          {is_processing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-cream/80 backdrop-blur-sm">
              <Loader2 className="size-5 animate-spin text-gold-deep" />
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone/60" />
              <Input
                value={url_draft}
                onChange={(event) => set_url_draft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void apply_remote_url();
                  }
                }}
                placeholder="https://... o pega una URL de imagen"
                className="h-10 rounded-lg pl-9 text-[0.78rem]"
                aria-label={`URL de ${label.toLowerCase()}`}
              />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => void apply_remote_url()} disabled={is_processing}>
              Usar URL
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={file_input_ref}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(event) => void handle_file_change(event)}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => file_input_ref.current?.click()}
              disabled={is_processing}
            >
              <Upload className="size-3.5" />
              Subir archivo
            </Button>
            <span className="text-[0.64rem] text-stone/70">JPG, PNG, WEBP o AVIF · máximo 15 MB</span>
          </div>
          {value && is_image_data_url(value) ? (
            <p className="text-[0.64rem] text-success">Archivo adaptado y comprimido automáticamente en WebP.</p>
          ) : null}
          {local_error || error ? <p className="text-[0.72rem] leading-relaxed text-danger">{local_error || error}</p> : null}
        </div>
      </div>

      {warning ? (
        <div className={cn("rounded-lg border px-3 py-2 text-[0.7rem] leading-relaxed", warning_tone_classes[warning.severity])}>
          {warning.message}
        </div>
      ) : null}
    </div>
  );
}
