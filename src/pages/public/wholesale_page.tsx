import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  TrendingUp,
  UserRound,
  X
} from "lucide-react";
import { ContentIcon } from "@/components/shared/content_icon";
import { EmptyState } from "@/components/shared/empty_state";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section_heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HERO_IMAGE_URLS, WHOLESALE_BENEFITS } from "@/core/data/vesuviana_landing_content";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { build_whatsapp_url, format_whatsapp_display } from "@/core/services/whatsapp_link_service";
import { cn } from "@/lib/utils";

const START_STEPS = [
  {
    step_number: "01",
    step_title: "Conversa con nosotros",
    step_description: "Escríbenos por WhatsApp y cuéntanos sobre tu negocio, tu ubicación y el volumen que manejas."
  },
  {
    step_number: "02",
    step_title: "Recibe tu asesoría",
    step_description: "Un asesor de tu estado te acompaña con precios, portafolio y recomendaciones según tu mercado."
  },
  {
    step_number: "03",
    step_title: "Coordina tu pedido",
    step_description: "Definimos tu selección y coordinamos el despacho nacional con seguimiento cercano."
  }
];

export function WholesalePage() {
  const { site_state } = use_vesuviana_app();
  const [search_query, set_search_query] = useState("");
  const [state_filter, set_state_filter] = useState("all");
  const active_advisors = site_state.wholesale_advisors.filter((advisor_item) => advisor_item.is_active);
  const zone_advisors = active_advisors
    .filter((advisor_item) => !advisor_item.is_general_manager)
    .sort((a, b) => a.state_name.localeCompare(b.state_name, "es"));
  const available_states = Array.from(new Set(zone_advisors.map((advisor_item) => advisor_item.state_name))).sort((a, b) =>
    a.localeCompare(b, "es")
  );

  const filtered_advisors = useMemo(() => {
    const normalized_query = search_query.trim().toLowerCase();
    return zone_advisors.filter((advisor_item) => {
      if (state_filter !== "all" && advisor_item.state_name !== state_filter) {
        return false;
      }
      if (!normalized_query) {
        return true;
      }
      return [advisor_item.advisor_name, advisor_item.state_name, advisor_item.zone_name]
        .join(" ")
        .toLowerCase()
        .includes(normalized_query);
    });
  }, [zone_advisors, search_query, state_filter]);

  const clear_filters = () => {
    set_search_query("");
    set_state_filter("all");
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={HERO_IMAGE_URLS.salon_space}
            alt="Salón de belleza profesional"
            loading="eager"
            className="size-full opacity-40"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#141312_0%,rgba(20,19,18,0.92)_50%,rgba(20,19,18,0.5)_100%)]" />
        <div className="page-shell relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold-bright" />
              <span className="label-caps text-gold-bright">Ventas al mayor</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-balance text-display-section text-cream">
              Crecemos cuando tu negocio crece.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-cream/60 sm:text-base">
              Un portafolio completo, márgenes pensados para revender y un equipo que conoce el mercado venezolano.
              Vesuviana es una alianza, no solo un proveedor.
            </p>
            <div className="mt-8">
              <a
                href="#asesores"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold-bright px-7 text-sm font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Buscar mi asesor
                <ArrowDown className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-cream/15 bg-cream/15">
              <div className="bg-ink/80 p-5 backdrop-blur sm:p-6">
                <p className="font-display text-4xl text-gold-bright">10</p>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.14em] text-cream/50">Estados con asesor</p>
              </div>
              <div className="bg-ink/80 p-5 backdrop-blur sm:p-6">
                <p className="font-display text-4xl text-gold-bright">+11</p>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.14em] text-cream/50">Categorías de producto</p>
              </div>
              <div className="bg-ink/80 p-5 backdrop-blur sm:p-6">
                <p className="font-display text-4xl text-gold-bright">03</p>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.14em] text-cream/50">Marcas en portafolio</p>
              </div>
              <div className="bg-ink/80 p-5 backdrop-blur sm:p-6">
                <p className="font-display text-4xl text-gold-bright">100%</p>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.14em] text-cream/50">Cobertura nacional</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space bg-cream">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Por qué Vesuviana"
              title="Una sociedad comercial con estructura real."
              description="No entregamos una lista de precios y desaparecemos. Construimos una relación con producto, logística y acompañamiento para que tu negocio pueda sostener su crecimiento."
            />
          </Reveal>
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHOLESALE_BENEFITS.map((benefit_item, benefit_index) => (
              <Reveal key={benefit_item.benefit_id} delay={benefit_index * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white/55 p-6 transition-colors hover:border-gold/40">
                  <span className="flex size-10 items-center justify-center rounded-full border border-gold/30 text-gold-deep">
                    <ContentIcon icon_key={benefit_item.icon_key} className="size-[1.1rem]" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl leading-tight text-ink">{benefit_item.title}</h3>
                  <p className="mt-2 text-[0.78rem] leading-relaxed text-stone">{benefit_item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="asesores" className="section-space bg-cream">
        <div className="page-shell">
          <Reveal>
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Red de asesores"
                title="Un asesor cerca de tu negocio."
                description="Nuestro equipo comercial está distribuido por estado. Encuentra a la persona que conoce tu zona y puede acompañarte de forma directa."
              />
              <div className="flex items-center gap-2 rounded-full border border-line bg-sand/40 px-4 py-2">
                <UserRound className="size-4 text-gold-deep" />
                <span className="text-[0.7rem] text-stone">
                  <strong className="font-semibold text-ink">{zone_advisors.length}</strong> asesores regionales
                </span>
              </div>
            </div>
          </Reveal>

          <div className="mt-9 grid gap-3 rounded-2xl border border-line bg-white/45 p-4 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
              <Input
                type="search"
                value={search_query}
                onChange={(event) => set_search_query(event.target.value)}
                placeholder="Buscar asesor, estado o zona..."
                className="h-11 rounded-full border-line bg-white/80 pl-11 pr-10"
                aria-label="Buscar asesor mayorista"
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
                Todos
              </button>
              {available_states.map((state_name) => (
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
                  {state_name}
                </button>
              ))}
            </div>
          </div>

          {filtered_advisors.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered_advisors.map((advisor_item, advisor_index) => {
                const initials = advisor_item.advisor_name
                  .split(" ")
                  .slice(0, 2)
                  .map((name_part) => name_part[0])
                  .join("");
                return (
                  <Reveal key={advisor_item.advisor_id} delay={(advisor_index % 3) * 0.06}>
                    <article className="group flex h-full flex-col rounded-2xl border border-line bg-white/55 p-6 transition-colors hover:border-gold/40">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex size-12 items-center justify-center rounded-full bg-sand font-display text-lg text-gold-deep">
                          {initials}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/80 px-3 py-1 text-[0.58rem] uppercase tracking-[0.1em] text-gold-deep">
                          <MapPin className="size-3" />
                          {advisor_item.state_name}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-2xl leading-tight text-ink">{advisor_item.advisor_name}</h3>
                      <p className="mt-1.5 flex-1 text-[0.76rem] leading-relaxed text-stone">{advisor_item.zone_name}</p>
                      <a
                        href={build_whatsapp_url(
                          advisor_item.whatsapp_number,
                          `Hola ${advisor_item.advisor_name}, quiero información sobre ventas al mayor de Vesuviana Cosmetics en ${advisor_item.state_name}.`
                        )}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[0.72rem] font-medium text-ink transition-colors group-hover:text-gold-deep"
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle className="size-4 text-gold-deep" />
                          {format_whatsapp_display(advisor_item.whatsapp_number)}
                        </span>
                        <ArrowUpRight className="size-4" />
                      </a>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No encontramos un asesor con ese filtro"
              description="Prueba con otro estado o escribe directamente a Gerencia Nacional para que te orientemos."
              className="mt-8"
              action={
                <Button onClick={clear_filters} variant="outline">
                  Ver todos los asesores
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="page-shell grid gap-12 py-16 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Cómo empezar"
              title="Tres pasos para trabajar juntos."
              description="Un proceso claro, sin promesas vacías. Primero entendemos tu negocio; después construimos la propuesta."
              theme="light"
            />
            <div className="mt-9 flex flex-col gap-5">
              {START_STEPS.map((start_step) => (
                <div key={start_step.step_number} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold-bright/30 font-display text-sm text-gold-bright">
                    {start_step.step_number}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-cream">{start_step.step_title}</h3>
                    <p className="mt-1 max-w-md text-[0.78rem] leading-relaxed text-cream/50">{start_step.step_description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[1.75rem] border border-cream/15 bg-cream/[0.04] p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <Handshake className="size-5 text-gold-bright" />
                <h2 className="font-display text-3xl text-cream">Perfil mayorista</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/50">
                Buscamos aliados comprometidos con la experiencia del cliente y con ganas de hacer crecer su categoría
                de belleza.
              </p>
              <ul className="mt-6 space-y-4">
                {WHOLESALE_PROFILE_ITEMS.map((profile_item) => (
                  <li key={profile_item} className="flex items-start gap-3 text-[0.8rem] leading-relaxed text-cream/65">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-bright/15 text-gold-bright">
                      <Check className="size-3" />
                    </span>
                    {profile_item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex items-center gap-3 border-t border-cream/10 pt-5 text-[0.7rem] text-cream/40">
                <Truck className="size-4 text-gold-bright/70" />
                Despachos coordinados a toda Venezuela.
              </div>
              {general_manager ? (
                <a
                  href={build_whatsapp_url(
                    general_manager.whatsapp_number,
                    "Hola, cumplo el perfil mayorista y quiero iniciar el proceso con Vesuviana Cosmetics."
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-cream text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
                >
                  Iniciar conversación
                  <ArrowRight className="size-4" />
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand/50">
        <div className="page-shell flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-full border border-gold/30 bg-cream text-gold-deep">
              <TrendingUp className="size-5" />
            </span>
            <div>
              <p className="label-caps text-[0.54rem] text-gold-deep">Ya eres parte de la red</p>
              <h2 className="mt-1 font-display text-2xl text-ink">Encuentra material y puntos de venta autorizados.</h2>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/distribuidores">
              Ver distribuidores
              <Sparkles className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
