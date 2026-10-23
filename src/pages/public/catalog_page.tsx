import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { EmptyState } from "@/components/shared/empty_state";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { ProductCard } from "@/components/shared/product_card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section_heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HERO_IMAGE_URLS } from "@/core/data/vesuviana_landing_content";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { cn } from "@/lib/utils";

type CatalogSortOption = "featured" | "name_asc" | "name_desc" | "recent";

export function CatalogPage() {
  const { site_state } = use_vesuviana_app();
  const [search_params, set_search_params] = useSearchParams();
  const [search_query, set_search_query] = useState("");
  const [category_filter, set_category_filter] = useState("all");
  const [sort_option, set_sort_option] = useState<CatalogSortOption>("featured");
  const brand_param = search_params.get("marca") || "all";

  const active_brands = site_state.brands
    .filter((brand_item) => brand_item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const selected_brand = active_brands.find((brand_item) => brand_item.brand_slug === brand_param);
  const selected_brand_id = selected_brand?.brand_id || "all";

  const available_categories = site_state.categories
    .filter(
      (category_item) =>
        category_item.is_active && (selected_brand_id === "all" || category_item.brand_id === selected_brand_id)
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    if (category_filter !== "all" && !available_categories.some((category_item) => category_item.category_id === category_filter)) {
      set_category_filter("all");
    }
  }, [available_categories, category_filter]);

  const filtered_products = useMemo(() => {
    const normalized_query = search_query.trim().toLowerCase();
    const matching_products = site_state.products.filter((product_item) => {
      if (!product_item.is_active) {
        return false;
      }
      if (selected_brand_id !== "all" && product_item.brand_id !== selected_brand_id) {
        return false;
      }
      if (category_filter !== "all" && product_item.category_id !== category_filter) {
        return false;
      }
      if (!normalized_query) {
        return true;
      }
      const brand = site_state.brands.find((brand_item) => brand_item.brand_id === product_item.brand_id);
      const category = site_state.categories.find((category_item) => category_item.category_id === product_item.category_id);
      return [product_item.product_name, product_item.product_description, brand?.brand_name, category?.category_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized_query);
    });

    return matching_products.sort((a, b) => {
      if (sort_option === "name_asc") {
        return a.product_name.localeCompare(b.product_name, "es");
      }
      if (sort_option === "name_desc") {
        return b.product_name.localeCompare(a.product_name, "es");
      }
      if (sort_option === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }
      return a.product_name.localeCompare(b.product_name, "es");
    });
  }, [site_state.brands, site_state.categories, site_state.products, selected_brand_id, category_filter, search_query, sort_option]);

  const has_active_filters = Boolean(search_query) || category_filter !== "all" || brand_param !== "all";

  const clear_filters = () => {
    set_search_query("");
    set_category_filter("all");
    set_sort_option("featured");
    set_search_params({});
  };

  const update_brand_filter = (brand_slug: string) => {
    set_category_filter("all");
    if (brand_slug === "all") {
      set_search_params({});
      return;
    }
    set_search_params({ marca: brand_slug });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0 opacity-35">
          <ImageWithFallback src={HERO_IMAGE_URLS.dark_cosmetics} alt="" loading="eager" className="size-full" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#141312_0%,rgba(20,19,18,0.92)_50%,rgba(20,19,18,0.55)_100%)]" />
        <div className="page-shell relative py-16 sm:py-20 lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold-bright" />
              <span className="label-caps text-gold-bright">Catálogo</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-balance text-display-section text-cream">
              Cabello que se siente cuidado.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-cream/60 sm:text-base">
              Explora los tratamientos de Defile, Oleos y Tricomplex. Filtra por marca, categoría o nombre y encuentra
              el producto que tu cabello necesita.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/15 pt-6">
              <span className="text-[0.68rem] uppercase tracking-[0.14em] text-cream/45">
                <strong className="mr-1.5 font-display text-xl font-normal text-gold-bright">{active_brands.length}</strong>
                marcas
              </span>
              <span className="text-[0.68rem] uppercase tracking-[0.14em] text-cream/45">
                <strong className="mr-1.5 font-display text-xl font-normal text-gold-bright">
                  {site_state.categories.filter((category_item) => category_item.is_active).length}
                </strong>
                categorías
              </span>
              <span className="text-[0.68rem] uppercase tracking-[0.14em] text-cream/45">
                <strong className="mr-1.5 font-display text-xl font-normal text-gold-bright">
                  {site_state.products.filter((product_item) => product_item.is_active).length}
                </strong>
                productos
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-cream">
        <div className="page-shell py-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => update_brand_filter("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.78rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep",
                brand_param === "all"
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-transparent text-stone hover:border-ink/30 hover:text-ink"
              )}
            >
              Todas las marcas
            </button>
            {active_brands.map((brand_item) => (
              <button
                key={brand_item.brand_id}
                type="button"
                onClick={() => update_brand_filter(brand_item.brand_slug)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.78rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep",
                  brand_param === brand_item.brand_slug
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-transparent text-stone hover:border-ink/30 hover:text-ink"
                )}
              >
                {brand_item.brand_name}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
              <Input
                type="search"
                value={search_query}
                onChange={(event) => set_search_query(event.target.value)}
                placeholder="Buscar por producto, marca o categoría..."
                className="h-11 rounded-full border-line bg-white/70 pl-11 pr-10"
                aria-label="Buscar productos"
              />
              {search_query ? (
                <button
                  type="button"
                  onClick={() => set_search_query("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Select value={category_filter} onValueChange={set_category_filter}>
                <SelectTrigger className="w-full rounded-full lg:w-56" aria-label="Filtrar por categoría">
                  <div className="flex items-center gap-2 truncate">
                    <SlidersHorizontal className="size-3.5 shrink-0 text-stone" />
                    <SelectValue placeholder="Categoría" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {available_categories.map((category_item) => (
                    <SelectItem key={category_item.category_id} value={category_item.category_id}>
                      {category_item.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={sort_option} onValueChange={(value) => set_sort_option(value as CatalogSortOption)}>
              <SelectTrigger className="w-full rounded-full lg:w-48" aria-label="Ordenar productos">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados primero</SelectItem>
                <SelectItem value="name_asc">Nombre: A - Z</SelectItem>
                <SelectItem value="name_desc">Nombre: Z - A</SelectItem>
                <SelectItem value="recent">Más recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="section-space bg-cream">
        <div className="page-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-caps text-[0.56rem] text-gold-deep">
                {selected_brand ? selected_brand.brand_name : "Todas las marcas"}
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                {category_filter === "all"
                  ? "Todos los productos"
                  : available_categories.find((category_item) => category_item.category_id === category_filter)?.category_name}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-stone">
                {filtered_products.length} {filtered_products.length === 1 ? "producto" : "productos"}
              </p>
              {has_active_filters ? (
                <button
                  type="button"
                  onClick={clear_filters}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-deep transition-colors hover:text-ink"
                >
                  <X className="size-3.5" />
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          </div>

          {selected_brand ? (
            <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-line bg-sand/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-[0.78rem] leading-relaxed text-stone">{selected_brand.brand_description}</p>
              <Link
                to={`/catalogo?marca=${selected_brand.brand_slug}`}
                className="inline-flex shrink-0 items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gold-deep"
              >
                Colección {selected_brand.brand_name}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          ) : null}

          {filtered_products.length > 0 ? (
            <div className="mt-10 grid gap-x-5 gap-y-11 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered_products.map((product_item, product_index) => (
                <Reveal key={product_item.product_id} delay={(product_index % 4) * 0.05}>
                  <ProductCard product={product_item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No encontramos ese producto"
              description="Prueba con otro término de búsqueda o elimina los filtros activos para volver a ver toda la colección."
              className="mt-10"
              action={
                <Button onClick={clear_filters} variant="outline">
                  Ver todos los productos
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="border-t border-line bg-sand/40">
        <div className="page-shell flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <SectionHeading
            eyebrow="¿Compras para tu negocio?"
            title="Lleva Vesuviana a tu salón o tienda."
            title_className="text-3xl sm:text-4xl"
          />
          <Button asChild size="lg">
            <Link to="/mayoristas">
              Ver ventas al mayor
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
