import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(ellipse_at_70%_0%,rgba(181,137,56,0.16),transparent_58%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8 lg:px-10">
        <span className="eyebrow flex items-center gap-2">
          <Sparkles className="size-3.5" />
          Fuera de catálogo
        </span>
        <p className="mt-8 font-display text-[clamp(7rem,22vw,16rem)] leading-[0.75] tracking-[-0.06em] text-ink">
          404<span className="text-gold">.</span>
        </p>
        <h1 className="mt-8 max-w-2xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.02] text-balance text-ink">
          Esta página se perdió entre los tratamientos.
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-stone sm:text-base">
          El enlace que buscas no existe o cambió de lugar. Vuelve al inicio o explora el catálogo para encontrar tu
          próximo cuidado Vesuviana.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/catalogo">
              Explorar catálogo
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
