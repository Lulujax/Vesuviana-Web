import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Clock3 } from "lucide-react";
import { VesuvianaLogo } from "@/components/brand/vesuviana_logo";
import { SocialLinks } from "@/components/shared/social_links";
import { CONTACT_CONTENT, NAVIGATION_LINKS } from "@/core/data/vesuviana_landing_content";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { build_whatsapp_url, format_whatsapp_display } from "@/core/services/whatsapp_link_service";

export function SiteFooter() {
  const { site_state } = use_vesuviana_app();
  const active_brands = site_state.brands.filter((brand_item) => brand_item.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const current_year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="page-shell grid gap-12 py-16 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr] lg:gap-10 lg:py-20">
        <div className="max-w-sm">
          <VesuvianaLogo theme="light" link_to="/" />
          <p className="mt-6 text-sm leading-relaxed text-cream/55">
            Una casa venezolana de belleza que une fórmulas profesionales, bio-activos y el ritual de cuidarse todos los días.
          </p>
          <SocialLinks theme="light" className="mt-7" />
        </div>

        <div>
          <h3 className="label-caps text-[0.6rem] text-gold-bright">Explorar</h3>
          <ul className="mt-5 space-y-3">
            {NAVIGATION_LINKS.map((nav_link) => (
              <li key={nav_link.link_id}>
                <Link to={nav_link.href} className="text-sm text-cream/65 transition-colors hover:text-cream">
                  {nav_link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-caps text-[0.6rem] text-gold-bright">Nuestras marcas</h3>
          <ul className="mt-5 space-y-3">
            {active_brands.map((brand_item) => (
              <li key={brand_item.brand_id}>
                <Link
                  to={`/catalogo?marca=${brand_item.brand_slug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-cream/65 transition-colors hover:text-cream"
                >
                  {brand_item.brand_name}
                  <ArrowUpRight className="size-3 text-cream/30" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-caps text-[0.6rem] text-gold-bright">Contacto</h3>
          <ul className="mt-5 space-y-4 text-sm text-cream/65">
            <li>
              <a
                href={build_whatsapp_url(CONTACT_CONTENT.whatsapp_number, "Hola Vesuviana Cosmetics, quiero más información.")}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-start gap-3 transition-colors hover:text-cream"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold-bright/80" />
                {format_whatsapp_display(CONTACT_CONTENT.whatsapp_number)}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_CONTENT.email}`} className="inline-flex items-start gap-3 transition-colors hover:text-cream">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-bright/80" />
                {CONTACT_CONTENT.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-bright/80" />
              {CONTACT_CONTENT.address}
            </li>
            <li className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-gold-bright/80" />
              {CONTACT_CONTENT.schedule}
            </li>
          </ul>
        </div>
      </div>

      <div className="page-shell flex flex-col gap-4 border-t border-cream/10 py-6 text-[0.7rem] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {current_year} Vesuviana Cosmetics. Todos los derechos reservados.</p>
        <div className="flex items-center gap-5">
          <span>Defile · Oleos · Tricomplex</span>
          <Link to="/admin" className="transition-colors hover:text-gold-bright">
            Acceso administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
