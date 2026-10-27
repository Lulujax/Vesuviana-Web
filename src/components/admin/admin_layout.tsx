import { Suspense, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  ArrowUpRight,
  Images,
  LayoutDashboard,
  Layers3,
  LoaderCircle,
  LogOut,
  Menu,
  Package,
  RotateCcw,
  ScrollText,
  Store,
  UserCog,
  UsersRound,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { VesuvianaLogo } from "@/components/brand/vesuviana_logo";
import { normalize_admin_error } from "@/components/admin/admin_error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { role_label } from "@/core/services/audit_trail_service";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, super_admin_only: false, exact: true },
  { href: "/admin/carrusel", label: "Carrusel", icon: Images, super_admin_only: false, exact: false },
  { href: "/admin/marcas", label: "Marcas y categorías", icon: Layers3, super_admin_only: false, exact: false },
  { href: "/admin/productos", label: "Productos", icon: Package, super_admin_only: false, exact: false },
  { href: "/admin/asesores", label: "Asesores mayoristas", icon: UserCog, super_admin_only: false, exact: false },
  { href: "/admin/distribuidores", label: "Distribuidores", icon: Store, super_admin_only: false, exact: false },
  { href: "/admin/usuarios", label: "Usuarios", icon: UsersRound, super_admin_only: true, exact: false },
  { href: "/admin/auditoria", label: "Auditoría", icon: ScrollText, super_admin_only: true, exact: false }
] as const;

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Resumen",
  "/admin/carrusel": "Carrusel",
  "/admin/marcas": "Marcas y categorías",
  "/admin/productos": "Productos",
  "/admin/asesores": "Asesores mayoristas",
  "/admin/distribuidores": "Distribuidores",
  "/admin/usuarios": "Usuarios",
  "/admin/auditoria": "Auditoría"
};

export function AdminLayout() {
  const { active_user, is_super_admin, logout, restore_factory_data } = use_vesuviana_app();
  const location = useLocation();
  const [is_mobile_open, set_is_mobile_open] = useState(false);
  const visible_nav_items = ADMIN_NAV_ITEMS.filter((nav_item) =>
    is_super_admin
      ? nav_item.href === "/admin" || nav_item.super_admin_only
      : !nav_item.super_admin_only
  );

  useEffect(() => {
    set_is_mobile_open(false);
  }, [location.pathname]);

  const handle_restore = () => {
    try {
      restore_factory_data();
      toast.success("Datos restaurados", { description: "El sitio volvió a su contenido de fábrica." });
    } catch (caught_error) {
      toast.error("No se pudo restaurar", { description: normalize_admin_error(caught_error).message });
    }
  };

  if (!active_user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const initials = active_user.full_name
    .split(" ")
    .slice(0, 2)
    .map((name_part) => name_part[0])
    .join("");

  if (active_user.is_banned) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand/40 p-5">
        <div className="w-full max-w-lg rounded-[2rem] border border-line bg-cream p-8 text-center shadow-[0_30px_80px_-50px_rgba(20,19,18,0.5)] sm:p-10">
          <VesuvianaLogo link_to="/" show_tagline={false} className="justify-center" />
          <span className="mx-auto mt-8 flex size-14 items-center justify-center rounded-full border border-danger/25 bg-danger/8 text-danger">
            <UsersRound className="size-6" />
          </span>
          <h1 className="mt-5 font-display text-4xl text-ink">Cuenta suspendida</h1>
          <p className="mt-3 text-sm leading-relaxed text-stone">
            El acceso de {active_user.full_name} fue suspendido por el usuario superior. Vuelve al sitio público o
            contacta al administrador principal.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button variant="outline" onClick={logout}>
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
            <Button asChild>
              <Link to="/">Volver al sitio público</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE5] text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17.5rem] flex-col bg-ink text-cream lg:flex">
        <div className="px-6 pb-8 pt-7">
          <VesuvianaLogo theme="light" show_tagline={false} compact />
          <p className="mt-4 text-[0.6rem] uppercase tracking-[0.2em] text-cream/35">Panel de administración</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Navegación del panel">
          {visible_nav_items.map((nav_item) => {
            const IconComponent = nav_item.icon;
            return (
              <NavLink
                key={nav_item.href}
                to={nav_item.href}
                end={nav_item.exact}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.8rem] transition-colors",
                    isActive
                      ? "bg-cream/10 text-cream"
                      : "text-cream/50 hover:bg-cream/5 hover:text-cream/80"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent className={cn("size-4", isActive ? "text-gold-bright" : "text-cream/35 group-hover:text-cream/60")} />
                    <span className="flex-1">{nav_item.label}</span>
                    {isActive ? <span className="size-1.5 rounded-full bg-gold-bright" /> : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-cream/10 p-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-cream/10 px-3.5 py-2.5 text-[0.72rem] text-cream/55 transition-colors hover:border-gold/40 hover:text-cream"
          >
            Ver sitio público
            <ExternalLink className="size-3.5" />
          </Link>
          {is_super_admin ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-[0.7rem] text-cream/35 transition-colors hover:bg-danger/10 hover:text-cream/70"
                >
                  <RotateCcw className="size-3.5" />
                  Restaurar datos de fábrica
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Restaurar todo el contenido?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminarán los cambios realizados en el carrusel, marcas, categorías, productos, asesores,
                    distribuidores y usuarios. La acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handle_restore}>
                    Sí, restaurar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          <div className="flex items-center gap-3 rounded-xl bg-cream/[0.06] p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-bright/15 font-display text-sm text-gold-bright">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.72rem] font-medium text-cream">{active_user.full_name}</p>
              <p className="truncate text-[0.6rem] text-cream/40">{role_label(active_user.role)}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-cream/40 transition-colors hover:bg-cream/10 hover:text-cream"
              aria-label="Cerrar sesión"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[17.5rem]">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-[#F5EFE5]/92 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">
            <div className="flex items-center gap-3">
              <Sheet open={is_mobile_open} onOpenChange={set_is_mobile_open}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon_sm" className="lg:hidden" aria-label="Abrir menú del panel">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-ink text-cream">
                  <SheetHeader>
                    <VesuvianaLogo theme="light" show_tagline={false} compact />
                    <SheetTitle className="sr-only">Menú del panel</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 flex flex-col gap-1" aria-label="Navegación móvil del panel">
                    {visible_nav_items.map((nav_item) => {
                      const IconComponent = nav_item.icon;
                      return (
                        <NavLink
                          key={nav_item.href}
                          to={nav_item.href}
                          end={nav_item.exact}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors",
                              isActive ? "bg-cream/10 text-cream" : "text-cream/50 hover:bg-cream/5 hover:text-cream"
                            )
                          }
                        >
                          <IconComponent className="size-4" />
                          {nav_item.label}
                        </NavLink>
                      );
                    })}
                  </nav>
                  <div className="mt-auto space-y-3 border-t border-cream/10 pt-5">
                    <div className="flex items-center gap-3 rounded-xl bg-cream/[0.06] p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-bright/15 font-display text-sm text-gold-bright">
                        {initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.72rem] font-medium text-cream">{active_user.full_name}</p>
                        <p className="truncate text-[0.6rem] text-cream/40">{role_label(active_user.role)}</p>
                      </div>
                    </div>
                    <Link
                      to="/"
                      target="_blank"
                      className="flex items-center justify-between rounded-xl border border-cream/10 px-3.5 py-2.5 text-[0.72rem] text-cream/55"
                    >
                      Ver sitio público
                      <ExternalLink className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-cream/[0.06] px-3.5 py-2.5 text-[0.72rem] text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
                    >
                      <LogOut className="size-3.5" />
                      Cerrar sesión
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
              <div>
                <p className="label-caps text-[0.5rem] text-stone/60">Administración</p>
                <p className="text-sm font-medium text-ink">{PAGE_TITLES[location.pathname] || "Panel"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-line bg-white/50 px-3 py-1.5 sm:flex">
                <span className="font-display text-xs text-gold-deep">{initials}</span>
                <span className="text-[0.68rem] text-stone">{role_label(active_user.role)}</span>
              </div>
              <Link
                to="/"
                target="_blank"
                className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-white/50 text-stone transition-colors hover:border-ink/30 hover:text-ink"
                aria-label="Abrir sitio público"
              >
                <ArrowUpRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-white/50 text-stone transition-colors hover:border-danger/40 hover:text-danger"
                aria-label="Cerrar sesión"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-stone">
                <LoaderCircle className="size-6 animate-spin text-gold-deep" />
                <p className="text-[0.7rem] uppercase tracking-[0.14em]">Cargando módulo</p>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export function SuperAdminRoute() {
  const { is_super_admin } = use_vesuviana_app();
  if (!is_super_admin) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}

export function ModeratorRoute() {
  const { can_manage_content } = use_vesuviana_app();
  if (!can_manage_content) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}
