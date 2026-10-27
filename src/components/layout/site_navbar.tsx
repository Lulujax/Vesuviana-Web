import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, MessageCircle } from "lucide-react";
import { VesuvianaLogo } from "@/components/brand/vesuviana_logo";
import { SocialLinks } from "@/components/shared/social_links";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CONTACT_CONTENT, NAVIGATION_LINKS } from "@/core/data/vesuviana_landing_content";
import { build_whatsapp_url, format_whatsapp_display } from "@/core/services/whatsapp_link_service";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
  const location = useLocation();
  const [is_scrolled, set_is_scrolled] = useState(false);
  const [is_mobile_open, set_is_mobile_open] = useState(false);
  const is_home = location.pathname === "/";
  const is_transparent = is_home && !is_scrolled;

  useEffect(() => {
    const handle_scroll = () => set_is_scrolled(window.scrollY > 16);
    handle_scroll();
    window.addEventListener("scroll", handle_scroll, { passive: true });
    return () => window.removeEventListener("scroll", handle_scroll);
  }, []);

  useEffect(() => {
    set_is_mobile_open(false);
  }, [location.pathname, location.hash]);

  const is_link_active = (href: string) => {
    if (href === "/") {
      return location.pathname === "/" && !location.hash;
    }
    if (href.startsWith("/#")) {
      return false;
    }
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
        is_transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line/80 bg-cream/92 shadow-[0_12px_40px_-32px_rgba(20,19,18,0.55)] backdrop-blur-xl"
      )}
    >
      <div className="page-shell flex h-20 items-center justify-between gap-6">
        <VesuvianaLogo theme={is_transparent ? "light" : "dark"} show_tagline={false} compact />

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex"
          aria-label="Navegación principal"
        >
          {NAVIGATION_LINKS.map((nav_link) => {
            const is_active = is_link_active(nav_link.href);
            return (
              <Link
                key={nav_link.link_id}
                to={nav_link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.8rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright",
                  is_transparent
                    ? "text-cream/75 hover:text-cream"
                    : "text-stone hover:text-ink",
                  is_active && (is_transparent ? "text-cream" : "text-ink")
                )}
              >
                {nav_link.label}
                {is_active ? (
                  <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold-bright" aria-hidden="true" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <Sheet open={is_mobile_open} onOpenChange={set_is_mobile_open}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright lg:hidden",
                is_transparent
                  ? "border-cream/25 text-cream hover:border-cream/60"
                  : "border-ink/15 text-ink hover:bg-ink/5"
              )}
              aria-label="Abrir menú de navegación"
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-cream">
            <SheetHeader>
              <VesuvianaLogo show_tagline={false} compact />
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Navegación móvil">
              {NAVIGATION_LINKS.map((nav_link, index) => (
                <Link
                  key={nav_link.link_id}
                  to={nav_link.href}
                  className="group flex items-center justify-between border-b border-line py-4 font-display text-3xl text-ink transition-colors hover:text-gold-deep"
                >
                  <span>{nav_link.label}</span>
                  <span className="label-caps text-[0.55rem] text-stone/60">0{index + 1}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto space-y-5 border-t border-line pt-6">
              <a
                href={build_whatsapp_url(
                  CONTACT_CONTENT.whatsapp_number,
                  "Hola Vesuviana Cosmetics, quiero recibir asesoría sobre sus productos."
                )}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between rounded-2xl border border-line bg-sand/50 px-4 py-3 text-sm text-ink transition-colors hover:border-gold/50"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-gold-deep" />
                  {format_whatsapp_display(CONTACT_CONTENT.whatsapp_number)}
                </span>
                <ArrowUpRight className="size-4 text-stone" />
              </a>
              <div className="flex items-center justify-between gap-4">
                <span className="label-caps text-[0.56rem] text-stone">Síguenos</span>
                <SocialLinks />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
