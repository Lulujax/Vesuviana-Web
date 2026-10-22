import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallback_label?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallback_label = "Vesuviana Cosmetics",
  loading = "lazy",
  sizes
}: ImageWithFallbackProps) {
  const [has_error, set_has_error] = useState(false);
  if (!src || has_error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,#F2E9DE,#FAF6F0_58%,#E8DAC6)] p-6 text-center",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span className="flex size-12 items-center justify-center rounded-full border border-gold/30 bg-cream/70 text-gold-deep">
          <ImageOff className="size-5" />
        </span>
        <span className="label-caps max-w-[16rem] text-[0.58rem] text-gold-deep">{fallback_label}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      sizes={sizes}
      onError={() => set_has_error(true)}
      className={cn("object-cover object-center", className)}
    />
  );
}
