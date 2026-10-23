import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import type { VesuvianaBrand } from "@/core/types/vesuviana_domain_types";
import { cn } from "@/lib/utils";

interface BrandCardProps {
  brand: VesuvianaBrand;
  index?: number;
  className?: string;
}

export function BrandCard({ brand, index = 0, className }: BrandCardProps) {
  const { site_state } = use_vesuviana_app();
  const category_count = site_state.categories.filter(
    (category_item) => category_item.brand_id === brand.brand_id && category_item.is_active
  ).length;
  const product_count = site_state.products.filter(
    (product_item) => product_item.brand_id === brand.brand_id && product_item.is_active
  ).length;

  return (
    <Link
      to={`/catalogo?marca=${brand.brand_slug}`}
      className={cn(
        "group relative flex min-h-[30rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-cream/15 transition-all duration-500 hover:border-gold-bright/40 hover:shadow-[0_24px_60px_-24px_rgba(20,19,18,0.7)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-4 focus-visible:ring-offset-cream",
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
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/5" />
      <div className="relative z-10 p-6 text-cream sm:p-7">
        <div className="flex items-center justify-between">
          <span className="label-caps text-[0.55rem] text-gold-bright">0{index + 1} · Colección</span>
          <span className="rounded-full bg-cream/10 px-2.5 py-0.5 text-[0.58rem] tracking-wider text-cream/70 backdrop-blur-xs">
            @{brand.brand_slug}.ve
          </span>
        </div>
        <h3 className="mt-3 font-display text-4xl leading-none">{brand.brand_name}</h3>
        <p className="mt-3 line-clamp-2 max-w-sm text-[0.82rem] leading-relaxed text-cream/75">{brand.brand_description}</p>
        <div className="mt-6 flex items-center justify-between border-t border-cream/15 pt-4">
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-cream/55">
            {category_count} categorías · {product_count} productos
          </span>
          <span className="flex size-9 items-center justify-center rounded-full border border-cream/25 transition-all duration-300 group-hover:border-gold-bright group-hover:bg-gold-bright group-hover:text-ink">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
