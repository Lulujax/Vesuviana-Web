import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  X
} from "lucide-react";
import { InstagramIcon } from "@/components/brand/social_icons";
import { EmptyState } from "@/components/shared/empty_state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section_heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { get_instagram_display_label, normalize_instagram_link } from "@/core/services/instagram_link_service";
import { build_whatsapp_url, format_whatsapp_display } from "@/core/services/whatsapp_link_service";
import { cn } from "@/lib/utils";

export function DistributorsPage() {
  const { site_state } = use_vesuviana_app();
  const [search_query, set_search_query] = useState("");
  const [state_filter, set_state_filter] = useState("all");
  const active_distributors = site_state.distributors
    .filter((distributor_item) => distributor_item.is_active)
    .sort((a, b) => a.state_name.localeCompare(b.state_name, "es") || a.store_name.localeCompare(b.store_name, "es"));
  const state_names = Array.from(new Set(active_distributors.map((distributor_item) => distributor_item.state_name))).sort(
    (a, b) => a.localeCompare(b, "es")
  );

  const filtered_distributors = useMemo(() => {
    const normalized_query = search_query.trim().toLowerCase();
    return active_distributors.filter((distributor_item) => {
      if (state_filter !== "all" && distributor_item.state_name !== state_filter) {
        return false;
      }
      if (!normalized_query) {
        return true;
      }
      return [
        distributor_item.store_name,
        distributor_item.state_name,
        distributor_item.zone_name,
        distributor_item.address_line
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized_query);
    });
  }, [active_distributors, search_query, state_filter]);

  const clear_filters = () => {
    set_search_query("");
    set_state_filter("all");
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-sand/55">
        <div className="absolute -right-24 top-1/2 size-[28rem] -translate-y-1/2 rounded-full border border-gold/20" />
        <div className="absolute -right-10 top-1/2 size-72 -translate-y-1/2 rounded-full border border-gold/15" />
        <div className="page-shell relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="label-caps text-gold-deep">Distribuidores autorizados</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-balance text-display-section text-ink">
              Belleza cerca de ti.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-stone sm:text-base">
              Encuentra un punto de venta oficial de Vesuviana Cosmetics en tu estado. Cada tienda de esta red está
              verificada y cuenta con acompañamiento directo de nuestro equipo.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
              <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.1em] text-stone">
                <Store className="size-4 text-gold-deep" />
                {active_distributors.length} puntos activos
              </span>
              <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.1em] text-stone">
                <MapPin className="size-4 text-gold-deep" />
                {state_names.length} estados
              </span>
              <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.1em] text-stone">
                <BadgeCheck className="size-4 text-gold-deep" />
                Red verificada
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[1.75rem] border border-line bg-cream/75 p-7 shadow-[0_28px_70px_-50px_rgba(20,19,18,0.5)] backdrop-blur sm:p-8">
              <span className="flex size-11 items-center justify-center rounded-full border border-gold/30 text-gold-deep">
                <ShoppingBag className="size-5" />
              </span>
              <h2 className="mt-5 font-display text-3xl leading-tight text-ink">Compra con confianza.</h2>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-stone">
                Nuestros distribuidores son la única red autorizada para la venta presencial de Vesuviana. Verifica
                siempre el punto antes de comprar.
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <ShieldCheck className="size-5 shrink-0 text-gold-deep" />
                <p className="text-[0.7rem] leading-relaxed text-stone">Productos originales, almacenamiento adecuado y asesoría de uso.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space bg-cream">
        <div className="page-shell">
          <div className="grid gap-3 rounded-2xl border border-line bg-white/45 p-4 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
              <Input
                type="search"
                value={search_query}
                onChange={(event) => set_search_query(event.target.value)}
                placeholder="Buscar tienda, estado, zona o dirección..."
                className="h-11 rounded-full border-line bg-white/80 pl-11 pr-10"
                aria-label="Buscar distribuidor"
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
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => set_state_filter("all")}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.72rem] font-medium transition-colors",
                  state_filter === "all" ? "border-ink bg-ink text-cream" : "border-line text-stone hover:border-ink/30"
                )}
              >
                Todos los estados
              </button>
              {state_names.map((state_name) => {
                const state_count = active_distributors.filter(
                  (distributor_item) => distributor_item.state_name === state_name
                ).length;
                return (
                  <button
                    key={state_name}
                    type="button"
                    onClick={() => set_state_filter(state_name)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-[0.72rem] font-medium transition-colors",
                      state_filter === state_name
                        ? "border-ink bg-ink text-cream"
                        : "border-line text-stone hover:border-ink/30"
                    )}
                  >
                    {state_name} <span className="opacity-50">{state_count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-caps text-[0.55rem] text-gold-deep">
                {state_filter === "all" ? "Directorio nacional" : state_filter}
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                {filtered_distributors.length} {filtered_distributors.length === 1 ? "punto de venta" : "puntos de venta"}
              </h2>
            </div>
            {search_query || state_filter !== "all" ? (
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

          {filtered_distributors.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered_distributors.map((distributor_item, distributor_index) => {
                const instagram_link = normalize_instagram_link(distributor_item.instagram_handle_or_url);
                return (
                  <Reveal key={distributor_item.distributor_id} delay={(distributor_index % 3) * 0.05}>
                    <article className="group flex h-full flex-col rounded-2xl border border-line bg-white/55 p-6 transition-colors hover:border-gold/40">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex size-11 items-center justify-center rounded-full bg-sand text-gold-deep">
                          <Store className="size-5" />
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/80 px-3 py-1 text-[0.58rem] uppercase tracking-[0.1em] text-gold-deep">
                            <MapPin className="size-3" />
                            {distributor_item.state_name}
                          </span>
                          <span className="text-[0.6rem] text-stone/60">{distributor_item.zone_name}</span>
                        </div>
                      </div>
                      <h3 className="mt-5 font-display text-2xl leading-tight text-ink">{distributor_item.store_name}</h3>
                      <p className="mt-2 flex-1 text-[0.76rem] leading-relaxed text-stone">{distributor_item.address_line}</p>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <a
                          href={build_whatsapp_url(
                            distributor_item.whatsapp_number,
                            `Hola ${distributor_item.store_name}, quisiera consultar disponibilidad de productos Vesuviana.`
                          )}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[0.7rem] font-medium text-cream transition-colors hover:bg-ink/90"
                        >
                          <MessageCircle className="size-3.5" />
                          WhatsApp
                        </a>
                        {instagram_link ? (
                          <a
                            href={instagram_link}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/15 px-4 text-[0.7rem] font-medium text-ink transition-colors hover:border-ink/40 hover:bg-sand/40"
                            aria-label={`Abrir Instagram de ${distributor_item.store_name}`}
                          >
                            <InstagramIcon className="size-3.5" />
                            {get_instagram_display_label(distributor_item.instagram_handle_or_url)}
                          </a>
                        ) : null}
                      </div>

                      <p className="mt-4 border-t border-line pt-4 text-[0.66rem] text-stone/60">
                        {format_whatsapp_display(distributor_item.whatsapp_number)}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No encontramos un punto con ese filtro"
              description="Prueba con otro estado o término de búsqueda. También puedes consultar la red mayorista para una referencia cercana."
              className="mt-8"
              action={
                <Button onClick={clear_filters} variant="outline">
                  Ver todos los distribuidores
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="border-y border-line bg-sand/45">
        <div className="page-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Haz parte de la red"
              title="¿Tienes una tienda o salón?"
              description="Si tu negocio comparte nuestra visión de belleza consciente y calidad profesional, conversemos. Estamos expandiendo la red de distribuidores en Venezuela."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/mayoristas">
                  Quiero distribuir
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/catalogo">Conocer el portafolio</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-cream/70 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-gold-deep" />
                <h3 className="font-display text-2xl text-ink">Canales oficiales</h3>
              </div>
              <ul className="mt-5 space-y-4 text-[0.78rem] leading-relaxed text-stone">
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  Compra únicamente en tiendas de este directorio o a través de nuestros asesores mayoristas.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  Verifica que el producto conserve su empaque, lote y sellos originales.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  Si detectas una venta no autorizada, repórtala con nuestro equipo por WhatsApp.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
