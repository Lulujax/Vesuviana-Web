import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { VesuvianaLogo } from "@/components/brand/vesuviana_logo";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VESUVIANA_MEDIA } from "@/core/data/vesuviana_media";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { normalize_admin_error } from "@/components/admin/admin_error";

export function AdminLoginPage() {
  const { active_user, login } = use_vesuviana_app();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [show_password, set_show_password] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  const redirect_to = (location.state as { from?: string } | null)?.from || "/admin";

  useEffect(() => {
    if (active_user) {
      navigate("/admin", { replace: true });
    }
  }, [active_user, navigate]);

  const handle_submit = async (event: React.FormEvent) => {
    event.preventDefault();
    set_is_submitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenido, ${user.full_name}`, { description: "Sesión iniciada correctamente." });
      navigate(redirect_to, { replace: true });
    } catch (caught_error) {
      toast.error("No pudimos iniciar sesión", { description: normalize_admin_error(caught_error).message });
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-ink text-cream lg:block">
        <ImageWithFallback
          src={VESUVIANA_MEDIA.hero.editorial}
          alt="Campaña Vesuviana Cosmetics"
          loading="eager"
          className="absolute inset-0 size-full opacity-70"
          sizes="55vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,18,0.3)_0%,rgba(20,19,18,0.55)_55%,rgba(20,19,18,0.96)_100%)]" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <VesuvianaLogo theme="light" show_tagline={false} compact />
          <div className="max-w-md">
            <span className="label-caps text-gold-bright">Panel privado</span>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] text-cream">
              El cuidado del cabello, detrás de cada detalle.
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-cream/60">
              Gestiona el catálogo, la red comercial y el contenido público de Vesuviana Cosmetics.
            </p>
          </div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-cream/35">Defile · Oleos · Tricomplex</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <VesuvianaLogo show_tagline={false} compact />
          </div>
          <div className="mt-10 lg:mt-0">
            <span className="flex size-11 items-center justify-center rounded-full border border-gold/30 bg-sand/50 text-gold-deep">
              <LockKeyhole className="size-5" />
            </span>
            <h2 className="mt-6 font-display text-4xl text-ink">Iniciar sesión</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              Acceso exclusivo para el equipo autorizado de Vesuviana Cosmetics.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handle_submit}>
            <div>
              <label htmlFor="admin_email" className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink">
                Correo electrónico
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
                <Input
                  id="admin_email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => set_email(event.target.value)}
                  placeholder="nombre@vesuvianacosmetics.com"
                  className="h-12 rounded-xl bg-white/70 pl-11"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="admin_password" className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink">
                  Contraseña
                </label>
                <Link to="/admin/recuperar" className="text-[0.7rem] font-medium text-gold-deep hover:text-ink">
                  ¿La olvidaste?
                </Link>
              </div>
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
                <Input
                  id="admin_password"
                  type={show_password ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => set_password(event.target.value)}
                  placeholder="Tu contraseña"
                  className="h-12 rounded-xl bg-white/70 pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => set_show_password((current) => !current)}
                  className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink"
                  aria-label={show_password ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {show_password ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={is_submitting}>
              {is_submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {is_submitting ? "Verificando..." : "Entrar al panel"}
            </Button>
          </form>

          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-[0.75rem] text-stone sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
              <ArrowLeft className="size-3.5" />
              Volver al sitio público
            </Link>
            <span className="inline-flex items-center gap-1.5">
              Acceso restringido
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
