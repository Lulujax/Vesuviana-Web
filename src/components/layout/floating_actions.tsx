import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [is_visible, set_is_visible] = useState(false);
  const location = useLocation();
  const is_wholesale = location.pathname === "/mayoristas";

  useEffect(() => {
    const handle_scroll = () => set_is_visible(window.scrollY > 560);
    handle_scroll();
    window.addEventListener("scroll", handle_scroll, { passive: true });
    return () => window.removeEventListener("scroll", handle_scroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-2 sm:bottom-7 sm:right-7">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        className={cn(
          "flex size-10 items-center justify-center rounded-full border border-line bg-cream/90 text-stone shadow-sm backdrop-blur transition-all duration-300 hover:border-gold/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep",
          is_visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <ArrowUp className="size-4" />
      </button>

      {!is_wholesale && (
        <Link
          to="/mayoristas"
          aria-label="Ir a Ventas al Mayor"
          className="group relative flex size-14 items-center justify-center rounded-full bg-ink text-gold-bright shadow-[0_18px_40px_-18px_rgba(20,19,18,0.8)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <span className="absolute inset-0 rounded-full border border-gold-bright/30 animate-vesuviana-pulse" aria-hidden="true" />
          <MessageCircle className="size-6" />
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[0.65rem] font-medium text-cream opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
            Ventas al Mayor
          </span>
        </Link>
      )}
    </div>
  );
}
