import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Images,
  Layers3,
  Package,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UserCog,
  UsersRound
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin_page_header";
import { AdminStatusBadge } from "@/components/admin/admin_status_badge";
import { Button } from "@/components/ui/button";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import {
  action_label,
  module_label,
  role_label
} from "@/core/services/audit_trail_service";
import { format_audit_timestamp, get_relative_time_label } from "@/core/services/date_format_service";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { href: "/admin/carrusel", label: "Editar carrusel", description: "Portada, textos e imágenes.", icon: Images },
  { href: "/admin/marcas", label: "Marcas y categorías", description: "Estructura del catálogo.", icon: Layers3 },
  { href: "/admin/productos", label: "Gestionar productos", description: "Fórmulas, fotos y beneficios.", icon: Package },
  { href: "/admin/distribuidores", label: "Red de tiendas", description: "Puntos de venta autorizados.", icon: Store }
];

const get_greeting = () => {
  const current_hour = new Date().getHours();
  if (current_hour < 12) {
    return "Buenos días";
  }
  if (current_hour < 19) {
    return "Buenas tardes";
  }
  return "Buenas noches";
};

export function AdminDashboardPage() {
  const { site_state, active_user, is_super_admin } = use_vesuviana_app();
  const active_products = site_state.products.filter((product_item) => product_item.is_active).length;
  const active_brands = site_state.brands.filter((brand_item) => brand_item.is_active).length;
  const active_advisors = site_state.wholesale_advisors.filter((advisor_item) => advisor_item.is_active).length;
  const active_distributors = site_state.distributors.filter((distributor_item) => distributor_item.is_active).length;
  const active_slides = site_state.carousel_slides.filter((slide_item) => slide_item.is_active).length;
  const first_name = active_user?.full_name.split(" ")[0] || "equipo";
  const quick_actions = is_super_admin
    ? [
        { href: "/admin/usuarios", label: "Gestionar usuarios", description: "Crear moderadores y claves.", icon: UsersRound },
        { href: "/admin/auditoria", label: "Revisar auditoría", description: "Movimientos del panel.", icon: ShieldCheck }
      ]
    : QUICK_ACTIONS;

  const stat_cards = [
    {
      stat_label: "Productos activos",
      stat_value: active_products,
      stat_total: site_state.products.length,
      stat_href: "/admin/productos",
      icon: Package
    },
    {
      stat_label: "Marcas publicadas",
      stat_value: active_brands,
      stat_total: site_state.brands.length,
      stat_href: "/admin/marcas",
      icon: Layers3
    },
    {
      stat_label: "Asesores activos",
      stat_value: active_advisors,
      stat_total: site_state.wholesale_advisors.length,
      stat_href: "/admin/asesores",
      icon: UserCog
    },
    {
      stat_label: "Distribuidores",
      stat_value: active_distributors,
      stat_total: site_state.distributors.length,
      stat_href: "/admin/distribuidores",
      icon: Store
    }
  ];

  const publishing_overview = [
    { label: "Carrusel", active: active_slides, total: site_state.carousel_slides.length },
    { label: "Productos", active: active_products, total: site_state.products.length },
    { label: "Asesores", active: active_advisors, total: site_state.wholesale_advisors.length },
    { label: "Distribuidores", active: active_distributors, total: site_state.distributors.length }
  ];

  const recent_audit_logs = site_state.audit_logs.slice(0, 7);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Panel de control"
        title={`${get_greeting()}, ${first_name}.`}
        description={
          is_super_admin
            ? "Supervisa el contenido publicado, las cuentas y la actividad del panel. La edición de contenido corresponde a los moderadores."
            : "Este es el estado actual del contenido de Vesuviana Cosmetics. Los cambios se reflejan de inmediato en el sitio público."
        }
        action={
          <>
            <Button asChild variant="outline">
              <Link to="/" target="_blank">
                Ver sitio
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild>
              <Link to={is_super_admin ? "/admin/usuarios" : "/admin/productos"}>
                {is_super_admin ? "Gestionar usuarios" : "Gestionar catálogo"}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stat_cards.map((stat_card) => {
          const IconComponent = stat_card.icon;
          return (
            <Link
              key={stat_card.stat_label}
              to={stat_card.stat_href}
              className="group rounded-2xl border border-line bg-cream/70 p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-full bg-ink text-gold-bright">
                  <IconComponent className="size-4" />
                </span>
                <ArrowUpRight className="size-4 text-stone/30 transition-colors group-hover:text-gold-deep" />
              </div>
              <p className="mt-5 font-display text-4xl leading-none text-ink">{stat_card.stat_value}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-[0.68rem] uppercase tracking-[0.1em] text-stone">{stat_card.stat_label}</p>
                <span className="text-[0.62rem] text-stone/55">de {stat_card.stat_total}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-line bg-cream/70">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 className="font-display text-2xl text-ink">Actividad reciente</h2>
              <p className="mt-0.5 text-[0.7rem] text-stone">Movimientos registrados en el panel.</p>
            </div>
            {is_super_admin ? (
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/auditoria">
                  Ver todo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <AdminStatusBadge label="Solo lectura" tone="neutral" />
            )}
          </div>

          {is_super_admin ? (
            <ol className="divide-y divide-line">
              {recent_audit_logs.map((audit_log) => (
                <li key={audit_log.log_id} className="flex gap-3 px-5 py-4">
                  <span
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      audit_log.action_type === "DELETE" || audit_log.action_type === "BAN_USER"
                        ? "bg-danger"
                        : audit_log.action_type === "CREATE" || audit_log.action_type === "UNBAN_USER"
                          ? "bg-success"
                          : "bg-gold"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.8rem] leading-relaxed text-ink">{audit_log.change_summary}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.64rem] text-stone/70">
                      <span>{audit_log.actor_name}</span>
                      <span className="size-1 rounded-full bg-line" />
                      <span>{module_label(audit_log.module_name)}</span>
                      <span className="size-1 rounded-full bg-line" />
                      <span title={format_audit_timestamp(audit_log.occurred_at)}>
                        {get_relative_time_label(audit_log.occurred_at)}
                      </span>
                    </div>
                  </div>
                  <span className="hidden shrink-0 self-start rounded-full bg-sand/70 px-2 py-1 text-[0.55rem] uppercase tracking-[0.1em] text-stone sm:inline-flex">
                    {action_label(audit_log.action_type)}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="px-5 py-8">
              <div className="rounded-xl border border-line bg-sand/35 p-5">
                <ShieldCheck className="size-5 text-gold-deep" />
                <p className="mt-3 text-sm font-medium text-ink">Tu sesión tiene permisos de contenido.</p>
                <p className="mt-1 text-[0.76rem] leading-relaxed text-stone">
                  Puedes gestionar carrusel, marcas, categorías, productos, asesores y distribuidores. La auditoría y
                  la gestión de usuarios están reservadas al usuario superior.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-ink p-5 text-cream">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-caps text-[0.52rem] text-gold-bright">Estado del sitio</p>
              <h2 className="mt-1 font-display text-2xl text-cream">Contenido publicado</h2>
            </div>
            <Sparkles className="size-5 text-gold-bright" />
          </div>
          <div className="mt-6 space-y-4">
            {publishing_overview.map((overview_item) => {
              const percentage = overview_item.total > 0 ? (overview_item.active / overview_item.total) * 100 : 0;
              return (
                <div key={overview_item.label}>
                  <div className="flex items-center justify-between text-[0.68rem] text-cream/55">
                    <span>{overview_item.label}</span>
                    <span className="tabular-nums">
                      {overview_item.active}/{overview_item.total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-cream/10">
                    <div className="h-full rounded-full bg-gold-bright" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 border-t border-cream/10 pt-4">
            <p className="text-[0.64rem] leading-relaxed text-cream/40">
              {is_super_admin
                ? "Tu cuenta supervisa accesos y actividad. No modifica el contenido del catálogo."
                : "Puedes editar carrusel, marcas, productos, asesores y distribuidores."}
            </p>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="label-caps text-[0.52rem] text-gold-deep">Accesos rápidos</p>
            <h2 className="mt-1 font-display text-2xl text-ink">Continúa donde lo dejaste.</h2>
          </div>
          <div className="hidden items-center gap-2 text-[0.68rem] text-stone sm:flex">
            <UsersRound className="size-4 text-gold-deep" />
            {site_state.users.filter((user_item) => !user_item.is_banned).length} usuarios activos
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quick_actions.map((quick_action) => {
            const IconComponent = quick_action.icon;
            return (
              <Link
                key={quick_action.href}
                to={quick_action.href}
                className="group flex flex-col rounded-2xl border border-line bg-cream/65 p-5 transition-colors hover:border-gold/40"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-gold/25 text-gold-deep">
                  <IconComponent className="size-4" />
                </span>
                <p className="mt-4 text-sm font-semibold text-ink">{quick_action.label}</p>
                <p className="mt-1 flex-1 text-[0.72rem] leading-relaxed text-stone">{quick_action.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">
                  Abrir
                  <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-line bg-cream/55 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand text-gold-deep">
            <TrendingUp className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Última actualización del sitio</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-stone">{format_audit_timestamp(site_state.last_updated_at)}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-2xl border border-line bg-cream/55 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand text-gold-deep">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Sesión actual</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-stone">
              {active_user?.full_name} · {active_user ? role_label(active_user.role) : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
