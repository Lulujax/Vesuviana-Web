import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  ChevronRight,
  Leaf,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import { HeroCarousel } from "@/components/public/hero_carousel";
import { BrandCard } from "@/components/shared/brand_card";
import { ContentIcon } from "@/components/shared/content_icon";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { ProductCard } from "@/components/shared/product_card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section_heading";
import {
  HERO_IMAGE_URLS,
  STORY_IMAGE_URLS,
  STORY_VALUES,
  TESTIMONIALS,
  TESTIMONIAL_PHONE_IMAGE_URL,
  VALUE_PILLARS,
  WHOLESALE_BENEFITS
} from "@/core/data/vesuviana_landing_content";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { build_whatsapp_url } from "@/core/services/whatsapp_link_service";

const RITUAL_STEPS = [
  {
    step_number: "01",
    step_title: "Limpia",
    step_description: "Shampoos y limpiadores que preparan la fibra y la piel sin alterar su equilibrio."
  },
  {
    step_number: "02",
    step_title: "Nutre",
    step_description: "Óleos, mascarillas y serums con bio-activos que devuelven elasticidad y luminosidad."
  },
  {
    step_number: "03",
    step_title: "Sella",
    step_description: "Tratamientos de acabado que protegen, prolongan el resultado y realzan el brillo."
  }
];

export function HomePage() {
  const { site_state } = use_vesuviana_app();
  const active_brands = site_state.brands
    .filter((brand_item) => brand_item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const featured_products = site_state.products
    .filter((product_item) => product_item.is_active && product_item.is_featured)
    .slice(0, 8);
  const general_manager = site_state.wholesale_advisors.find(
    (advisor_item) => advisor_item.is_general_manager && advisor_item.is_active
  );

  return (
    <>
      <HeroCarousel />

      <section id="pilares" className="border-b border-line bg-cream">
        <div className="page-shell grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {VALUE_PILLARS.map((pillar_item, pillar_index) => (
            <Reveal key={pillar_item.pillar_id} delay={pillar_index * 0.06}>
              <div className="flex h-full flex-col gap-4 py-9 sm:px-7 lg:py-11">
                <span className="flex size-10 items-center justify-center rounded-full border border-gold/30 bg-sand/50 text-gold-deep">
                  <ContentIcon icon_key={pillar_item.icon_key} className="size-[1.1rem]" />
                </span>
                <div>
                  <h2 className="font-display text-[1.35rem] leading-tight text-ink">{pillar_item.title}</h2>
                  <p className="mt-2 text-[0.78rem] leading-relaxed text-stone">{pillar_item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="marcas" className="section-space bg-cream">
        <div className="page-shell">
          <Reveal>
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Nuestras casas"
                title={
                  <>
                    Tres marcas,
                    <br />
                    un mismo ritual de belleza.
                  </>
                }
                description="Defile, Oleos y Tricomplex nacen de una misma obsesión: fórmulas que se sienten tan bien como se ven. Cada casa tiene su lenguaje; juntas cuentan una historia completa."
              />
              <Link
                to="/catalogo"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-gold-deep"
              >
                Ver todo el catálogo
                <span className="flex size-8 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-gold/50">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {active_brands.map((brand_item, brand_index) => (
              <Reveal key={brand_item.brand_id} delay={brand_index * 0.1}>
                <BrandCard brand={brand_item} index={brand_index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="relative overflow-hidden bg-sand/45">
        <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-[radial-gradient(circle_at_60%_35%,rgba(212,175,55,0.16),transparent_60%)] lg:block" />
        <div className="page-shell grid items-center gap-14 py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:py-28">
          <Reveal className="relative">
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div className="absolute -left-4 -top-4 size-full rounded-[2rem] border border-gold/30" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <ImageWithFallback
                  src={STORY_IMAGE_URLS.main}
                  alt="Ritual de belleza Vesuviana Cosmetics"
                  className="size-full"
                  sizes="(min-width: 1024px) 34vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-5 w-40 overflow-hidden rounded-2xl border-[6px] border-cream shadow-[0_24px_60px_-24px_rgba(20,19,18,0.5)] sm:-right-8 sm:w-48">
                <div className="aspect-square">
                  <ImageWithFallback
                    src={STORY_IMAGE_URLS.secondary}
                    alt="Textura de productos naturales Vesuviana"
                    className="size-full"
                    sizes="12rem"
                  />
                </div>
              </div>
              <div className="absolute -left-5 bottom-14 hidden rounded-full border border-gold/30 bg-cream/95 px-4 py-3 shadow-sm backdrop-blur sm:flex sm:items-center sm:gap-2">
                <Leaf className="size-4 text-gold-deep" />
                <span className="label-caps text-[0.52rem] text-gold-deep">Bio-activos reales</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <SectionHeading
              eyebrow="Nuestra historia"
              title="Belleza que nace del cuidado, no de la prisa."
              description="Vesuviana Cosmetics nació en Venezuela con una idea sencilla: reunir en una sola casa la precisión de la cosmética profesional y la calidez de los ingredientes naturales. Hoy acompañamos a salones, distribuidores y personas que entienden la belleza como un ritual cotidiano."
            />
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-stone">
              Cada fórmula pasa por un proceso de selección de activos, pruebas de textura y control de calidad. No
              prometemos milagros: diseñamos productos que trabajan con tu cabello y tu piel, de forma constante y
              consciente.
            </p>

            <div className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {STORY_VALUES.map((value_item) => (
                <div key={value_item.value_id} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-deep">
                    <ContentIcon icon_key={value_item.icon_key} className="size-3.5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{value_item.title}</h3>
                    <p className="mt-1 text-[0.76rem] leading-relaxed text-stone">{value_item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 divide-x divide-line border-y border-line py-5">
              <div>
                <p className="font-display text-3xl text-ink">03</p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-stone">Marcas</p>
              </div>
              <div className="pl-5">
                <p className="font-display text-3xl text-ink">11</p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-stone">Categorías</p>
              </div>
              <div className="pl-5">
                <p className="font-display text-3xl text-ink">100%</p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-stone">Compromiso</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space bg-cream">
        <div className="page-shell">
          <Reveal>
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Selección Vesuviana"
                title="Favoritos que hablan por sí solos."
                description="Los productos que más se repiten en salones, tocadores y rutinas de cuidado. Una puerta de entrada al universo de nuestras tres marcas."
              />
              <Link
                to="/catalogo"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-gold-deep"
              >
                Explorar catálogo
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured_products.map((product_item, product_index) => (
              <Reveal key={product_item.product_id} delay={(product_index % 4) * 0.07}>
                <ProductCard product={product_item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src={HERO_IMAGE_URLS.salon_space}
            alt=""
            className="size-full"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#141312_0%,rgba(20,19,18,0.92)_46%,rgba(20,19,18,0.55)_100%)]" />
        <div className="page-shell relative grid gap-14 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="El ritual"
              title={
                <>
                  Tres pasos.
                  <br />
                  Un resultado que se siente.
                </>
              }
              description="No necesitas una rutina de diez pasos. Necesitas los correctos, aplicados con intención. Así entendemos el cuidado en Vesuviana."
              theme="light"
            />
            <Link
              to="/catalogo"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold-bright transition-colors hover:text-cream"
            >
              Armar mi ritual
              <ChevronRight className="size-4" />
            </Link>
          </Reveal>
          <div className="grid gap-3">
            {RITUAL_STEPS.map((ritual_step, ritual_index) => (
              <Reveal key={ritual_step.step_number} delay={ritual_index * 0.08}>
                <div className="group grid gap-4 rounded-2xl border border-cream/12 bg-cream/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-gold/40 hover:bg-cream/[0.06] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span className="font-display text-4xl text-gold-bright/80">{ritual_step.step_number}</span>
                  <div>
                    <h3 className="font-display text-2xl text-cream">{ritual_step.step_title}</h3>
                    <p className="mt-1 max-w-md text-[0.8rem] leading-relaxed text-cream/55">{ritual_step.step_description}</p>
                  </div>
                  <ArrowUpRight className="hidden size-5 text-cream/25 transition-colors group-hover:text-gold-bright sm:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-cream">
        <div className="page-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Historias reales"
              title="Lo que se dice después del primer uso."
              description="Nada reemplaza la experiencia. Estas son algunas de las conversaciones que nos recuerdan por qué hacemos lo que hacemos."
            />
            <div className="relative mt-9 max-w-sm overflow-hidden rounded-[1.75rem]">
              <div className="aspect-[4/5]">
                <ImageWithFallback
                  src={TESTIMONIAL_PHONE_IMAGE_URL}
                  alt="Clienta Vesuviana Cosmetics"
                  className="size-full"
                  sizes="(min-width: 1024px) 28vw, 80vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <Quote className="size-7 text-gold-bright" />
                <p className="mt-3 font-display text-2xl leading-tight text-cream">La constancia cambia todo.</p>
                <p className="mt-2 text-[0.72rem] text-cream/55">Comunidad Vesuviana · Venezuela</p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {TESTIMONIALS.map((testimonial_item, testimonial_index) => (
              <Reveal key={testimonial_item.testimonial_id} delay={(testimonial_index % 2) * 0.08}>
                <figure className="flex h-full flex-col justify-between rounded-[1.5rem] border border-line bg-white/60 p-6 shadow-[0_20px_50px_-40px_rgba(20,19,18,0.5)]">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-ink font-display text-sm text-gold-bright">
                          {testimonial_item.initials}
                        </span>
                        <div>
                          <figcaption className="text-sm font-semibold text-ink">{testimonial_item.customer_name}</figcaption>
                          <p className="text-[0.66rem] text-stone">{testimonial_item.customer_city}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-gold-bright">
                        {Array.from({ length: 5 }).map((_, star_index) => (
                          <Star key={star_index} className="size-3 fill-current" />
                        ))}
                      </span>
                    </div>
                    <blockquote className="mt-5 text-[0.84rem] leading-relaxed text-stone">
                      “{testimonial_item.message}”
                    </blockquote>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <span className="label-caps text-[0.52rem] text-gold-deep">{testimonial_item.brand_name}</span>
                    <span className="flex items-center gap-1.5 text-[0.6rem] text-stone/60">
                      {testimonial_item.timestamp_label}
                      <CheckCheck className="size-3.5 text-gold-deep" />
                    </span>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[55%]">
          <ImageWithFallback
            src={HERO_IMAGE_URLS.salon_space}
            alt="Salón profesional Vesuviana"
            className="size-full opacity-45"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#141312_0%,rgba(20,19,18,0.9)_35%,rgba(20,19,18,0.25)_100%)]" />
        </div>
        <div className="page-shell relative py-20 lg:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-bright" />
                <span className="label-caps text-gold-bright">Ventas al mayor</span>
              </div>
              <h2 className="mt-5 text-balance text-display-section text-cream">
                Tu negocio merece una marca que lo haga crecer.
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-cream/60 sm:text-base">
                Precios competitivos, logística nacional y acompañamiento real. Trabajamos junto a salones,
                distribuidores y tiendas de belleza en toda Venezuela.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/mayoristas"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold-bright px-7 text-sm font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Conocer el programa
                  <ArrowRight className="size-4" />
                </Link>
                {general_manager ? (
                  <a
                    href={build_whatsapp_url(
                      general_manager.whatsapp_number,
                      "Hola, quiero información sobre el programa de ventas al mayor de Vesuviana Cosmetics."
                    )}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-cream/25 px-7 text-sm font-medium text-cream transition-colors hover:border-cream/60 hover:bg-cream/5"
                  >
                    Hablar con gerencia
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid max-w-4xl gap-x-8 gap-y-7 border-t border-cream/15 pt-9 sm:grid-cols-2">
            {WHOLESALE_BENEFITS.map((benefit_item, benefit_index) => (
              <Reveal key={benefit_item.benefit_id} delay={benefit_index * 0.06}>
                <div className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold-bright/30 text-gold-bright">
                    <ContentIcon icon_key={benefit_item.icon_key} className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-cream">{benefit_item.title}</h3>
                    <p className="mt-1 text-[0.78rem] leading-relaxed text-cream/50">{benefit_item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {general_manager ? (
            <div className="mt-10 inline-flex flex-wrap items-center gap-3 rounded-full border border-cream/15 bg-ink/45 px-5 py-2.5 backdrop-blur">
              <ShieldCheck className="size-4 text-gold-bright" />
              <span className="text-[0.7rem] text-cream/55">Gerencia Nacional:</span>
              <span className="text-[0.75rem] font-medium text-cream">{general_manager.advisor_name}</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-sand/50">
        <div className="page-shell flex flex-col items-start justify-between gap-8 py-14 lg:flex-row lg:items-center">
          <div className="flex items-start gap-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-cream text-gold-deep">
              <MapPin className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-gold-deep" />
                <span className="label-caps text-[0.55rem] text-gold-deep">Red autorizada</span>
              </div>
              <h2 className="mt-2 max-w-xl font-display text-3xl leading-tight text-ink sm:text-4xl">
                Encuentra tu punto de venta Vesuviana más cercano.
              </h2>
              <p className="mt-2 text-sm text-stone">Distribuidores verificados en los principales estados del país.</p>
            </div>
          </div>
          <Link
            to="/distribuidores"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-ink/20 px-7 text-sm font-medium text-ink transition-colors hover:border-ink/50 hover:bg-cream"
          >
            Ver distribuidores
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
