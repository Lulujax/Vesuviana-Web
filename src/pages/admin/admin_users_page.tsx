import { useState } from "react";
import { Ban, Crown, Plus, ShieldCheck, UserCheck, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { AdminConfirmDelete } from "@/components/admin/admin_confirm_delete";
import { normalize_admin_error } from "@/components/admin/admin_error";
import { AdminFormField } from "@/components/admin/admin_form_field";
import { AdminPageHeader } from "@/components/admin/admin_page_header";
import { AdminStatusBadge } from "@/components/admin/admin_status_badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { role_label } from "@/core/services/audit_trail_service";
import { format_short_date } from "@/core/services/date_format_service";
import type { AdminUser, FieldErrorMap, ModeratorInput } from "@/core/types/vesuviana_domain_types";

const empty_moderator_input: ModeratorInput = { full_name: "", email: "" };

export function AdminUsersPage() {
  const { active_user, all_users, create_moderator, set_user_ban_status } = use_vesuviana_app();
  const [dialog_open, set_dialog_open] = useState(false);
  const [moderator_form, set_moderator_form] = useState<ModeratorInput>(empty_moderator_input);
  const [field_errors, set_field_errors] = useState<FieldErrorMap>({});
  const sorted_users = all_users.slice().sort((a, b) => {
    if (a.role !== b.role) {
      return a.role === "SUPER_ADMIN" ? -1 : 1;
    }
    return a.full_name.localeCompare(b.full_name, "es");
  });

  const open_create_dialog = () => {
    set_moderator_form(empty_moderator_input);
    set_field_errors({});
    set_dialog_open(true);
  };

  const handle_submit = () => {
    try {
      create_moderator(moderator_form);
      toast.success("Moderador creado", { description: "El nuevo usuario ya puede seleccionarse como sesión activa." });
      set_dialog_open(false);
      set_field_errors({});
    } catch (caught_error) {
      const normalized_error = normalize_admin_error(caught_error);
      set_field_errors(normalized_error.field_errors);
      if (Object.keys(normalized_error.field_errors).length === 0) {
        toast.error("No se pudo crear el moderador", { description: normalized_error.message });
      }
    }
  };

  const handle_ban_status = (user_item: AdminUser, should_be_banned: boolean) => {
    try {
      set_user_ban_status(user_item.user_id, should_be_banned);
      toast.success(should_be_banned ? "Usuario suspendido" : "Usuario reactivado", {
        description: should_be_banned
          ? `${user_item.full_name} ya no puede gestionar contenido.`
          : `${user_item.full_name} recuperó el acceso al panel.`
      });
    } catch (caught_error) {
      toast.error("No se pudo actualizar el usuario", { description: normalize_admin_error(caught_error).message });
    }
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Control de acceso"
        title="Usuarios"
        description="Crea moderadores y administra el estado de sus cuentas. Solo el usuario superior puede suspender o reactivar sesiones."
        action={
          <Button onClick={open_create_dialog}>
            <Plus className="size-4" />
            Nuevo moderador
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-cream/65 p-5">
          <span className="flex size-9 items-center justify-center rounded-full bg-ink text-gold-bright">
            <UsersRound className="size-4" />
          </span>
          <p className="mt-4 font-display text-3xl text-ink">{all_users.length}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.1em] text-stone">Usuarios totales</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream/65 p-5">
          <span className="flex size-9 items-center justify-center rounded-full bg-success/10 text-success">
            <UserCheck className="size-4" />
          </span>
          <p className="mt-4 font-display text-3xl text-ink">{all_users.filter((user_item) => !user_item.is_banned).length}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.1em] text-stone">Cuentas activas</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream/65 p-5">
          <span className="flex size-9 items-center justify-center rounded-full bg-danger/10 text-danger">
            <Ban className="size-4" />
          </span>
          <p className="mt-4 font-display text-3xl text-ink">{all_users.filter((user_item) => user_item.is_banned).length}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.1em] text-stone">Cuentas suspendidas</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-cream/65">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted_users.map((user_item) => {
              const initials = user_item.full_name
                .split(" ")
                .slice(0, 2)
                .map((name_part) => name_part[0])
                .join("");
              const is_current_user = user_item.user_id === active_user.user_id;
              const is_protected = user_item.role === "SUPER_ADMIN";
              return (
                <TableRow key={user_item.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand font-display text-sm text-gold-deep">
                        {initials}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-ink">{user_item.full_name}</p>
                          {is_current_user ? (
                            <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.08em] text-gold-deep">
                              Sesión actual
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-[0.68rem] text-stone/65">{user_item.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge
                      label={role_label(user_item.role)}
                      tone={user_item.role === "SUPER_ADMIN" ? "gold" : "neutral"}
                    />
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge
                      label={user_item.is_banned ? "Suspendido" : "Activo"}
                      tone={user_item.is_banned ? "danger" : "active"}
                    />
                  </TableCell>
                  <TableCell className="text-[0.72rem] text-stone">{format_short_date(user_item.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      {is_protected ? (
                        <span className="inline-flex items-center gap-1.5 text-[0.66rem] text-gold-deep">
                          <Crown className="size-3.5" />
                          Protegido
                        </span>
                      ) : user_item.is_banned ? (
                        <Button variant="outline" size="sm" onClick={() => handle_ban_status(user_item, false)}>
                          <UserCheck className="size-3.5" />
                          Reactivar
                        </Button>
                      ) : is_current_user ? (
                        <span className="text-[0.64rem] text-stone/50">No puedes suspenderte</span>
                      ) : (
                        <AdminConfirmDelete
                          title="Suspender usuario"
                          description={`${user_item.full_name} perderá el acceso inmediato al panel y verá la pantalla de cuenta suspendida. Puedes reactivarlo cuando quieras.`}
                          confirm_label="Suspender acceso"
                          on_confirm={() => handle_ban_status(user_item, true)}
                        >
                          <Button variant="outline" size="sm">
                            <Ban className="size-3.5" />
                            Suspender
                          </Button>
                        </AdminConfirmDelete>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-line bg-sand/35 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold-deep" />
        <p className="text-[0.74rem] leading-relaxed text-stone">
          Los usuarios creados aquí no requieren contraseña: el acceso a esta demo se realiza mediante el selector de
          sesión. En un entorno de producción se integraría un proveedor de autenticación.
        </p>
      </div>

      <Dialog open={dialog_open} onOpenChange={set_dialog_open}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo moderador</DialogTitle>
            <DialogDescription>
              El moderador podrá gestionar el contenido del sitio, pero no los usuarios ni la auditoría.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <AdminFormField label="Nombre completo" html_for="moderator_name" error={field_errors.full_name} required>
              <Input
                id="moderator_name"
                value={moderator_form.full_name}
                onChange={(event) => set_moderator_form((current_form) => ({ ...current_form, full_name: event.target.value }))}
                placeholder="Camila Duarte"
              />
            </AdminFormField>
            <AdminFormField label="Correo electrónico" html_for="moderator_email" error={field_errors.email} required>
              <Input
                id="moderator_email"
                type="email"
                value={moderator_form.email}
                onChange={(event) => set_moderator_form((current_form) => ({ ...current_form, email: event.target.value }))}
                placeholder="camila@vesuvianacosmetics.com"
              />
            </AdminFormField>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => set_dialog_open(false)}>
              Cancelar
            </Button>
            <Button onClick={handle_submit}>Crear moderador</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
