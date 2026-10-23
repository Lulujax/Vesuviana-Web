import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { BRAND_LOGOS } from "@/core/data/vesuviana_media";
import type { VesuvianaBrand } from "@/core/types/vesuviana_domain_types";
import { cn } from "@/lib/utils";

interface BrandCardProps {
  brand: VesuvianaBrand;
  index?: number;
  className?: string;
}

export function BrandCard({ brand, index = 0, className }: BrandCardProps) {
  const logo_url = BRAND_LOGOS[brand.brand_slug];

  return (
    <Link
      to={`/catalogo?marca=${brand.brand_slug}`}
      className={cn(
        "group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-line/50 transition-all duration-500 hover:border-gold/50 hover:shadow-[0_28px_65px_-30px_rgba(20,19,18,0.55)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-4 focus-visible:ring-offset-cream",
        className
      )}
    >
      <ImageWithFallback
        src={brand.image_url}
        alt={`Colección ${brand.brand_name}`}
        fallback_label={brand.brand_name}
        className="absolute inset-0 size-full transition-transform duration-[900ms] ease-out group-hover:scale-105"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/35 to-ink/5" />
      <div className="absolute left-5 top-5 flex h-16 w-32 items-center justify-center rounded-xl bg-cream/95 px-4 shadow-sm backdrop-blur sm:left-6 sm:top-6">
        {logo_url ? (
          <img src={logo_url} alt={`Logo ${brand.brand_name}`} className="max-h-9 w-full object-contain" />
        ) : (
          <span className="font-display text-2xl text-ink">{brand.brand_name}</span>
        )}
      </div>
      <div className="relative z-10 p-6 text-cream sm:p-7">
        <span className="label-caps text-[0.55rem] text-gold-bright">0{index + 1} · Marca</span>
        <h3 className="mt-3 font-display text-4xl leading-none">{brand.brand_name}</h3>
        <p className="mt-3 line-clamp-2 max-w-sm text-[0.82rem] leading-relaxed text-cream/75">
          {brand.brand_description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-cream/15 pt-4">
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-cream/55">Ver colección</span>
          <span className="flex size-9 items-center justify-center rounded-full border border-cream/25 transition-all duration-300 group-hover:border-gold-bright group-hover:bg-gold-bright group-hover:text-ink">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
