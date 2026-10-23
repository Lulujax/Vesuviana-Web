import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import type { VesuvianaProduct } from "@/core/types/vesuviana_domain_types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: VesuvianaProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { site_state } = use_vesuviana_app();
  const brand = site_state.brands.find((brand_item) => brand_item.brand_id === product.brand_id);
  const category = site_state.categories.find((category_item) => category_item.category_id === product.category_id);

  return (
    <Link
      to={`/catalogo/producto/${product.product_slug}`}
      className={cn(
        "group flex h-full flex-col rounded-[1.6rem] border border-line/60 bg-white/40 p-3 shadow-[0_8px_30px_-20px_rgba(20,19,18,0.2)] transition-all duration-300 hover:border-gold/45 hover:bg-white/85 hover:shadow-[0_20px_45px_-24px_rgba(20,19,18,0.35)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-sand">
        <ImageWithFallback
          src={product.image_urls[0] || ""}
          alt={product.product_name}
          fallback_label={brand?.brand_name || "Vesuviana"}
          className="size-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {product.is_featured ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-gold-deep backdrop-blur">
            <Sparkles className="size-3" />
            Destacado
          </span>
        ) : null}
        <span className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-cream text-ink opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="label-caps text-[0.55rem] text-gold-deep">{brand?.brand_name || "Vesuviana"}</span>
          <span className="truncate text-[0.66rem] text-stone/70">{category?.category_name}</span>
        </div>
        <h3 className="mt-2 font-display text-[1.45rem] leading-[1.05] text-ink transition-colors group-hover:text-gold-deep">
          {product.product_name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-relaxed text-stone">{product.product_description}</p>
        {product.product_benefits[0] ? (
          <div className="mt-auto pt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/60 px-2.5 py-1 text-[0.66rem] font-medium text-gold-deep">
              <span className="size-1 rounded-full bg-gold-deep" />
              <span className="line-clamp-1">{product.product_benefits[0]}</span>
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
