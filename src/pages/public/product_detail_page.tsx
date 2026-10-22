import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, MessageCircle, PackageSearch, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty_state";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { ProductCard } from "@/components/shared/product_card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { CONTACT_CONTENT } from "@/core/data/vesuviana_landing_content";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { build_whatsapp_url } from "@/core/services/whatsapp_link_service";
import { cn } from "@/lib/utils";

export function ProductDetailPage() {
  const { product_slug } = useParams<{ product_slug: string }>();
  const { site_state } = use_vesuviana_app();
  const [active_image_index, set_active_image_index] = useState(0);
  const product = site_state.products.find(
    (product_item) => product_item.product_slug === product_slug && product_item.is_active
  );

  useEffect(() => {
    set_active_image_index(0);
  }, [product_slug]);

  if (!product) {
    return (
      <div className="page-shell py-24">
        <EmptyState
          icon={PackageSearch}
          title="Este producto ya no está disponible"
          description="Puede que haya cambiado de nombre o que ya no forme parte del catálogo activo. Explora la colección completa para encontrar una alternativa."
          action={
            <Button asChild>
              <Link to="/catalogo">Volver al catálogo</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const brand = site_state.brands.find((brand_item) => brand_item.brand_id === product.brand_id);
  const category = site_state.categories.find((category_item) => category_item.category_id === product.category_id);
  const general_manager = site_state.wholesale_advisors.find(
    (advisor_item) => advisor_item.is_general_manager && advisor_item.is_active
  );
  const contact_number = general_manager?.whatsapp_number || CONTACT_CONTENT.whatsapp_number;
  const related_products = site_state.products
    .filter(
      (related_item) =>
        related_item.is_active &&
        related_item.product_id !== product.product_id &&
        (related_item.brand_id === product.brand_id || related_item.category_id === product.category_id)
    )
    .slice(0, 4);
  const active_image_url = product.image_urls[active_image_index] || product.image_urls[0] || "";
  const whatsapp_url = build_whatsapp_url(
    contact_number,
    `Hola Vesuviana Cosmetics, quiero información y disponibilidad de ${product.product_name}${
      brand ? ` de ${brand.brand_name}` : ""
    }.`
  );

  return (
    <>
      <div className="border-b border-line bg-cream">
        <div className="page-shell flex flex-wrap items-center gap-2 py-4 text-[0.68rem] text-stone">
          <Link to="/" className="transition-colors hover:text-ink">
            Inicio
          </Link>
          <ChevronRight className="size-3 text-stone/40" />
          <Link to="/catalogo" className="transition-colors hover:text-ink">
            Catálogo
          </Link>
          {brand ? (
            <>
              <ChevronRight className="size-3 text-stone/40" />
              <Link to={`/catalogo?marca=${brand.brand_slug}`} className="transition-colors hover:text-ink">
                {brand.brand_name}
              </Link>
            </>
          ) : null}
          <ChevronRight className="size-3 text-stone/40" />
          <span className="max-w-[13rem] truncate text-ink/70">{product.product_name}</span>
        </div>
      </div>

      <section className="bg-cream py-10 sm:py-14 lg:py-16">
        <div className="page-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex shrink-0 gap-3 sm:w-20 sm:flex-col">
              {product.image_urls.map((image_url, image_index) => (
                <button
                  key={`${image_url}-${image_index}`}
                  type="button"
                  onClick={() => set_active_image_index(image_index)}
                  aria-label={`Ver imagen ${image_index + 1} de ${product.product_name}`}
                  className={cn(
                    "relative aspect-square w-16 overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep sm:w-full",
                    image_index === active_image_index ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <ImageWithFallback
                    src={image_url}
                    alt={`${product.product_name}, vista ${image_index + 1}`}
                    className="size-full"
                    sizes="5rem"
                  />
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-[2rem] bg-sand">
              <div className="aspect-square">
                <ImageWithFallback
                  src={active_image_url}
                  alt={product.product_name}
                  loading="eager"
                  fallback_label={brand?.brand_name || "Vesuviana"}
                  className="size-full transition-opacity duration-300"
                  sizes="(min-width: 1024px) 48vw, 100vw"
                />
              </div>
              {product.is_featured ? (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-gold-deep backdrop-blur">
                  <Sparkles className="size-3" />
                  Destacado
                </span>
              ) : null}
            </div>
          </div>

          <Reveal className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              {brand ? (
                <Link
                  to={`/catalogo?marca=${brand.brand_slug}`}
                  className="label-caps text-[0.58rem] text-gold-deep transition-colors hover:text-ink"
                >
                  {brand.brand_name}
                </Link>
              ) : null}
              <span className="h-3 w-px bg-line" />
              <span className="text-[0.64rem] uppercase tracking-[0.12em] text-stone">{category?.category_name}</span>
            </div>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[0.98] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
              {product.product_name}
            </h1>
            <p className="mt-6 text-pretty text-sm leading-relaxed text-stone sm:text-[0.95rem]">
              {product.product_description}
            </p>

            <div className="mt-7">
              <p className="label-caps text-[0.55rem] text-gold-deep">Beneficios principales</p>
              <ul className="mt-4 space-y-3">
                {product.product_benefits.map((benefit_item) => (
                  <li key={benefit_item} className="flex items-start gap-3 text-[0.84rem] leading-relaxed text-ink/80">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-sand text-gold-deep">
                      <Check className="size-3" />
                    </span>
                    {benefit_item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-sand/35 p-5">
              <p className="text-[0.72rem] leading-relaxed text-stone">
                Este catálogo es informativo. Para conocer disponibilidad, precio mayorista o recomendación de uso,
                conversa con nuestro equipo por WhatsApp.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1">
                  <a href={whatsapp_url} target="_blank" rel="noreferrer noopener">
                    <MessageCircle className="size-4" />
                    Consultar por WhatsApp
                  </a>
                </Button>
                {brand ? (
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/catalogo?marca=${brand.brand_slug}`}>
                      Ver {brand.brand_name}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
              <div className="flex flex-col gap-1.5">
                <ShieldCheck className="size-4 text-gold-deep" />
                <span className="text-[0.62rem] uppercase tracking-[0.1em] text-stone">Calidad profesional</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Sparkles className="size-4 text-gold-deep" />
                <span className="text-[0.62rem] uppercase tracking-[0.1em] text-stone">Bio-activos</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Truck className="size-4 text-gold-deep" />
                <span className="text-[0.62rem] uppercase tracking-[0.1em] text-stone">Cobertura nacional</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {brand ? (
        <section className="border-y border-line bg-sand/35">
          <div className="page-shell grid items-center gap-8 py-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-14">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl lg:aspect-square">
              <ImageWithFallback
                src={brand.image_url}
                alt={`Marca ${brand.brand_name}`}
                className="size-full"
                sizes="(min-width: 1024px) 25vw, 100vw"
              />
            </div>
            <div>
              <span className="label-caps text-[0.55rem] text-gold-deep">La casa detrás de la fórmula</span>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{brand.brand_name}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone">{brand.brand_description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  to={`/catalogo?marca=${brand.brand_slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:text-gold-deep"
                >
                  Explorar la colección
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <a
                  href={brand.instagram_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-stone transition-colors hover:text-ink"
                >
                  Instagram oficial
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {related_products.length > 0 ? (
        <section className="section-space bg-cream">
          <div className="page-shell">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <span className="label-caps text-[0.56rem] text-gold-deep">También te puede gustar</span>
                <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Completa tu ritual.</h2>
              </div>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-gold-deep"
              >
                <ArrowLeft className="size-4" />
                Volver al catálogo
              </Link>
            </div>
            <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related_products.map((related_item, related_index) => (
                <Reveal key={related_item.product_id} delay={related_index * 0.06}>
                  <ProductCard product={related_item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
