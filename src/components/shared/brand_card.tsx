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
        "group relative flex min-h-[30rem] flex-col overflow-hidden rounded-[1.75rem] border border-line/50 bg-ink transition-all duration-500 hover:border-gold/50 hover:shadow-[0_28px_65px_-30px_rgba(20,19,18,0.55)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-4 focus-visible:ring-offset-cream",
        className
      )}
    >
      <div className="relative min-h-[16rem] flex-1 overflow-hidden bg-[#181615]">
        <div aria-hidden="true" className="absolute inset-0">
          <ImageWithFallback
            src={brand.image_url}
            alt=""
            className="size-full scale-110 object-cover opacity-25 blur-2xl"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>
        <ImageWithFallback
          src={brand.image_url}
          alt={`Colección ${brand.brand_name}`}
          fallback_label={brand.brand_name}
          loading="eager"
          className="absolute inset-0 z-[1] size-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-5"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <div className="relative z-10 bg-ink px-6 pb-6 pt-5 text-cream sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <span className="label-caps pt-1 text-[0.55rem] text-gold-bright">0{index + 1} · Marca</span>
          <span className="flex h-12 w-24 shrink-0 items-center justify-center rounded-lg bg-cream/95 px-3 shadow-sm">
            {logo_url ? (
              <img src={logo_url} alt={`Logo ${brand.brand_name}`} className="max-h-7 w-full object-contain" />
            ) : (
              <span className="font-display text-lg text-ink">{brand.brand_name}</span>
            )}
          </span>
        </div>
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
