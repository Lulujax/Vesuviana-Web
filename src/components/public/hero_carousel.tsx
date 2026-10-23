import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY = 7200;

export function HeroCarousel() {
  const { site_state } = use_vesuviana_app();
  const reduced_motion = useReducedMotion();
  const slides = site_state.carousel_slides
    .filter((slide_item) => slide_item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const [active_index, set_active_index] = useState(0);
  const [is_paused, set_is_paused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || is_paused || reduced_motion) {
      return;
    }
    const interval_id = window.setInterval(() => {
      set_active_index((current_index) => (current_index + 1) % slides.length);
    }, AUTOPLAY_DELAY);
    return () => window.clearInterval(interval_id);
  }, [slides.length, is_paused, reduced_motion]);

  useEffect(() => {
    if (active_index >= slides.length) {
      set_active_index(0);
    }
  }, [active_index, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="flex min-h-[38rem] items-center justify-center bg-ink px-6 text-center text-cream">
        <div>
          <p className="label-caps text-gold-bright">Vesuviana Cosmetics</p>
          <h1 className="mt-4 font-display text-6xl">Belleza que nace del cuidado</h1>
        </div>
      </section>
    );
  }

  const active_slide = slides[active_index];
  const go_to = (next_index: number) => {
    set_active_index((next_index + slides.length) % slides.length);
  };

  return (
    <section
      className="relative flex min-h-[42rem] flex-col overflow-hidden bg-ink text-cream lg:h-[78svh] lg:max-h-[54rem]"
      onMouseEnter={() => set_is_paused(true)}
      onMouseLeave={() => set_is_paused(false)}
      aria-roledescription="carrusel"
      aria-label="Colecciones Vesuviana Cosmetics"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={active_slide.slide_id}
          className="absolute inset-0"
          initial={reduced_motion ? false : { opacity: 0, scale: 1.04 }}
          animate={reduced_motion ? undefined : { opacity: 1, scale: 1 }}
          exit={reduced_motion ? undefined : { opacity: 0 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <ImageWithFallback
            src={active_slide.image_url}
            alt={active_slide.slide_title}
            loading="eager"
            className="size-full"
            fallback_label={active_slide.slide_title}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,19,18,0.86)_0%,rgba(20,19,18,0.5)_42%,rgba(20,19,18,0.12)_75%,rgba(20,19,18,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,18,0.56)_0%,transparent_30%,transparent_64%,rgba(20,19,18,0.85)_100%)]" />
      <div className="absolute inset-y-0 left-[clamp(1.25rem,5vw,4.5rem)] hidden w-px bg-cream/15 lg:block" />
      <Link
        to="/catalogo"
        className="absolute inset-0 z-[8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-bright"
        aria-label="Explorar el catálogo de Vesuviana Cosmetics"
      />

      <div className="page-shell pointer-events-none relative z-10 flex flex-1 flex-col justify-end pb-20 pt-32 sm:pb-24 lg:justify-center lg:pb-28">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active_slide.slide_id}-content`}
              initial={reduced_motion ? false : { opacity: 0, y: 26 }}
              animate={reduced_motion ? undefined : { opacity: 1, y: 0 }}
              exit={reduced_motion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-gold-bright" />
                <p className="label-caps text-gold-bright">{active_slide.slide_subtitle}</p>
              </div>
              <h1 className="mt-5 max-w-4xl text-balance text-display-hero text-cream">
                {active_slide.slide_title}
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-sm leading-relaxed text-cream/70 sm:text-base">
                {active_slide.slide_description}
              </p>
              <span className="mt-9 inline-flex items-center gap-2 border-b border-gold-bright/50 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-bright">
                Explorar catálogo
                <ArrowUpRight className="size-3.5" />
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="page-shell relative z-20 flex items-center justify-between gap-6 border-t border-cream/15 py-5">
        <a
          href="#pilares"
          className="group hidden items-center gap-3 text-[0.65rem] uppercase tracking-[0.16em] text-cream/50 transition-colors hover:text-cream sm:flex"
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-cream/20 transition-transform group-hover:translate-y-0.5">
            <ArrowDown className="size-3.5" />
          </span>
          Desliza para descubrir
        </a>

        <div className="flex flex-1 items-center gap-4 sm:flex-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go_to(active_index - 1)}
              className="flex size-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-gold-bright hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright"
              aria-label="Slide anterior"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go_to(active_index + 1)}
              className="flex size-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-gold-bright hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright"
              aria-label="Slide siguiente"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="flex flex-1 items-center gap-3 sm:w-52 sm:flex-none">
            <span className="text-[0.65rem] tabular-nums text-cream/60">0{active_index + 1}</span>
            <div className="relative h-px flex-1 overflow-hidden bg-cream/20">
              <motion.span
                key={`${active_slide.slide_id}-progress`}
                className="absolute inset-y-0 left-0 bg-gold-bright"
                initial={{ width: reduced_motion ? "100%" : "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: reduced_motion || is_paused ? 0 : AUTOPLAY_DELAY / 1000, ease: "linear" }}
              />
            </div>
            <span className="text-[0.65rem] tabular-nums text-cream/60">0{slides.length}</span>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex" role="tablist" aria-label="Seleccionar slide">
          {slides.map((slide_item, slide_index) => (
            <button
              key={slide_item.slide_id}
              type="button"
              onClick={() => set_active_index(slide_index)}
              aria-label={`Ir al slide ${slide_index + 1}: ${slide_item.slide_title}`}
              aria-selected={slide_index === active_index}
              role="tab"
              className={cn(
                "h-1 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright",
                slide_index === active_index ? "w-10 bg-gold-bright" : "w-4 bg-cream/30 hover:bg-cream/60"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
