import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { VesuvianaLogo } from "@/components/brand/vesuviana_logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminForgotPasswordPage() {
  const [email, set_email] = useState("");
  const [submitted_email, set_submitted_email] = useState("");

  const handle_submit = (event: React.FormEvent) => {
    event.preventDefault();
    set_submitted_email(email.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_10%,#F2E9DE,#FAF6F0_55%,#EADCC9)] px-5 py-12">
      <div className="w-full max-w-lg rounded-[2rem] border border-line bg-cream p-7 shadow-[0_35px_90px_-60px_rgba(20,19,18,0.55)] sm:p-10">
        <VesuvianaLogo show_tagline={false} compact />
        <span className="mt-8 flex size-11 items-center justify-center rounded-full border border-gold/30 bg-sand/50 text-gold-deep">
          <ShieldCheck className="size-5" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-ink">Recuperar acceso</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Escribe el correo de tu cuenta. Por ahora registraremos la solicitud en esta página; el envío automático se
          conectará cuando integremos el servicio de correo.
        </p>

        {submitted_email ? (
          <div className="mt-7 rounded-2xl border border-success/25 bg-success/8 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-ink">Solicitud registrada</p>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-stone">
                  Si <strong className="font-medium text-ink">{submitted_email}</strong> pertenece a una cuenta
                  autorizada, el usuario superior podrá restablecer la contraseña desde el panel de usuarios.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-7 space-y-5" onSubmit={handle_submit}>
            <div>
              <label htmlFor="recovery_email" className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink">
                Correo electrónico
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
                <Input
                  id="recovery_email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => set_email(event.target.value)}
                  placeholder="nombre@vesuvianacosmetics.com"
                  className="h-12 rounded-xl bg-white/70 pl-11"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Registrar solicitud
            </Button>
          </form>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <Link to="/admin/login" className="inline-flex items-center gap-2 text-[0.75rem] text-stone transition-colors hover:text-ink">
            <ArrowLeft className="size-3.5" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
