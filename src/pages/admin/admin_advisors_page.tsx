import { useMemo, useState } from "react";
import { MapPin, MessageCircle, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminConfirmDelete } from "@/components/admin/admin_confirm_delete";
import { normalize_admin_error } from "@/components/admin/admin_error";
import { AdminFormField } from "@/components/admin/admin_form_field";
import { AdminPageHeader } from "@/components/admin/admin_page_header";
import { AdminStatusBadge } from "@/components/admin/admin_status_badge";
import { EmptyState } from "@/components/shared/empty_state";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_VENEZUELA_STATE, VENEZUELA_STATES } from "@/core/constants/vesuviana_constants";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { format_whatsapp_display } from "@/core/services/whatsapp_link_service";
import type { AdvisorInput, FieldErrorMap, WholesaleAdvisor } from "@/core/types/vesuviana_domain_types";

const build_empty_advisor_input = (): AdvisorInput => ({
  advisor_name: "",
  state_name: DEFAULT_VENEZUELA_STATE,
  zone_name: "",
  whatsapp_number: "",
  is_active: true
});

export function AdminAdvisorsPage() {
  const { site_state, create_advisor, update_advisor, delete_advisor } = use_vesuviana_app();
  const [search_query, set_search_query] = useState("");
  const [state_filter, set_state_filter] = useState("all");
  const [dialog_open, set_dialog_open] = useState(false);
  const [editing_advisor_id, set_editing_advisor_id] = useState<string | null>(null);
  const [advisor_form, set_advisor_form] = useState<AdvisorInput>(build_empty_advisor_input());
  const [field_errors, set_field_errors] = useState<FieldErrorMap>({});

  const sorted_advisors = site_state.wholesale_advisors
    .slice()
    .sort((a, b) => a.state_name.localeCompare(b.state_name, "es"));
  const state_options = Array.from(
    new Set(site_state.wholesale_advisors.map((advisor_item) => advisor_item.state_name))
  ).sort((a, b) => a.localeCompare(b, "es"));

  const filtered_advisors = useMemo(() => {
    const normalized_query = search_query.trim().toLowerCase();
    return sorted_advisors.filter((advisor_item) => {
      if (state_filter !== "all" && advisor_item.state_name !== state_filter) {
        return false;
      }
      if (!normalized_query) {
        return true;
      }
      return [advisor_item.advisor_name, advisor_item.state_name, advisor_item.zone_name, advisor_item.whatsapp_number]
        .join(" ")
        .toLowerCase()
        .includes(normalized_query);
    });
  }, [sorted_advisors, search_query, state_filter]);

  const open_create_dialog = () => {
    set_editing_advisor_id(null);
    set_advisor_form(build_empty_advisor_input());
    set_field_errors({});
    set_dialog_open(true);
  };

  const open_edit_dialog = (advisor_item: WholesaleAdvisor) => {
    set_editing_advisor_id(advisor_item.advisor_id);
    set_advisor_form({
      advisor_name: advisor_item.advisor_name,
      state_name: advisor_item.state_name,
      zone_name: advisor_item.zone_name,
      whatsapp_number: advisor_item.whatsapp_number,
      is_active: advisor_item.is_active
    });
    set_field_errors({});
    set_dialog_open(true);
  };

  const update_form = (patch: Partial<AdvisorInput>) => {
    set_advisor_form((current_form) => ({ ...current_form, ...patch }));
  };

  const handle_submit = () => {
    try {
      if (editing_advisor_id) {
        update_advisor(editing_advisor_id, advisor_form);
        toast.success("Asesor actualizado", { description: "Los cambios ya están visibles en la página de mayoristas." });
      } else {
        create_advisor(advisor_form);
        toast.success("Asesor creado", { description: "El nuevo asesor ya forma parte de la red." });
      }
      set_dialog_open(false);
      set_field_errors({});
    } catch (caught_error) {
      const normalized_error = normalize_admin_error(caught_error);
      set_field_errors(normalized_error.field_errors);
      if (Object.keys(normalized_error.field_errors).length === 0) {
        toast.error("No se pudo guardar el asesor", { description: normalized_error.message });
      }
    }
  };

  const handle_delete = (advisor_item: WholesaleAdvisor) => {
    try {
      delete_advisor(advisor_item.advisor_id);
      toast.success("Asesor eliminado", { description: `Se retiró a ${advisor_item.advisor_name} de la red.` });
    } catch (caught_error) {
      toast.error("No se pudo eliminar", { description: normalize_admin_error(caught_error).message });
    }
  };

  const clear_filters = () => {
    set_search_query("");
    set_state_filter("all");
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Red comercial"
        title="Asesores mayoristas"
        description="Administra los contactos regionales que atienden a mayoristas y distribuidores en todo el país."
        action={
          <Button onClick={open_create_dialog}>
            <Plus className="size-4" />
            Nuevo asesor
          </Button>
        }
      />

      <div className="grid gap-3 rounded-2xl border border-line bg-cream/60 p-4 sm:grid-cols-[1fr_13rem_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
          <Input
            value={search_query}
            onChange={(event) => set_search_query(event.target.value)}
            placeholder="Buscar por nombre, estado, zona o número..."
            className="h-10 rounded-full bg-white/70 pl-10"
            aria-label="Buscar asesor"
          />
        </div>
        <Select value={state_filter} onValueChange={set_state_filter}>
          <SelectTrigger className="h-10 rounded-full" aria-label="Filtrar por estado">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {state_options.map((state_name) => (
              <SelectItem key={state_name} value={state_name}>
                {state_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {search_query || state_filter !== "all" ? (
          <Button variant="ghost" size="sm" onClick={clear_filters}>
            <X className="size-3.5" />
            Limpiar
          </Button>
        ) : (
          <span className="hidden items-center text-[0.68rem] text-stone sm:flex">
            {filtered_advisors.length} asesores
          </span>
        )}
      </div>

      {filtered_advisors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered_advisors.map((advisor_item) => {
            const initials = advisor_item.advisor_name
              .split(" ")
              .slice(0, 2)
              .map((name_part) => name_part[0])
              .join("");
            return (
              <article key={advisor_item.advisor_id} className="flex h-full flex-col rounded-2xl border border-line bg-cream/65 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-sand font-display text-lg text-gold-deep">
                    {initials}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon_sm" onClick={() => open_edit_dialog(advisor_item)} aria-label={`Editar ${advisor_item.advisor_name}`}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <AdminConfirmDelete
                      title="Eliminar asesor"
                      description={`Se retirará a ${advisor_item.advisor_name} de la red de asesores de ${advisor_item.state_name}.`}
                      on_confirm={() => handle_delete(advisor_item)}
                    >
                      <Button variant="ghost" size="icon_sm" aria-label={`Eliminar ${advisor_item.advisor_name}`}>
                        <Trash2 className="size-3.5 text-danger" />
                      </Button>
                    </AdminConfirmDelete>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <AdminStatusBadge
                    label={advisor_item.is_active ? "Activo" : "Inactivo"}
                    tone={advisor_item.is_active ? "active" : "inactive"}
                  />
                  <span className="inline-flex items-center gap-1 text-[0.62rem] text-stone">
                    <MapPin className="size-3" />
                    {advisor_item.state_name}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl leading-tight text-ink">{advisor_item.advisor_name}</h2>
                <p className="mt-1 flex-1 text-[0.74rem] leading-relaxed text-stone">{advisor_item.zone_name}</p>
                <p className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-[0.68rem] text-stone">
                  <MessageCircle className="size-3.5 text-gold-deep" />
                  {format_whatsapp_display(advisor_item.whatsapp_number)}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No encontramos asesores con ese filtro"
          description="Prueba con otro estado o término de búsqueda, o crea un nuevo asesor regional."
          action={
            <Button variant="outline" onClick={clear_filters}>
              Ver todos los asesores
            </Button>
          }
        />
      )}

      <Dialog open={dialog_open} onOpenChange={set_dialog_open}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing_advisor_id ? "Editar asesor" : "Nuevo asesor"}</DialogTitle>
            <DialogDescription>
              Los datos de contacto se muestran en la página de ventas al mayor. El número se normaliza para WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <AdminFormField label="Nombre completo" html_for="advisor_name" error={field_errors.advisor_name} required>
              <Input
                id="advisor_name"
                value={advisor_form.advisor_name}
                onChange={(event) => update_form({ advisor_name: event.target.value })}
                placeholder="María Victoria Quintero"
              />
            </AdminFormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminFormField label="Estado" html_for="advisor_state" error={field_errors.state_name} required>
                <Select value={advisor_form.state_name} onValueChange={(state_name) => update_form({ state_name })}>
                  <SelectTrigger id="advisor_state">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {VENEZUELA_STATES.map((state_name) => (
                      <SelectItem key={state_name} value={state_name}>
                        {state_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFormField>
              <AdminFormField label="WhatsApp" html_for="advisor_whatsapp" error={field_errors.whatsapp_number} required>
                <Input
                  id="advisor_whatsapp"
                  value={advisor_form.whatsapp_number}
                  onChange={(event) => update_form({ whatsapp_number: event.target.value })}
                  placeholder="+58 412 555 0199"
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Zona de atención" html_for="advisor_zone" error={field_errors.zone_name} required>
              <Input
                id="advisor_zone"
                value={advisor_form.zone_name}
                onChange={(event) => update_form({ zone_name: event.target.value })}
                placeholder="Valencia y área metropolitana"
              />
            </AdminFormField>

            <div className="flex items-center justify-between rounded-xl border border-line bg-sand/35 px-4 py-3">
              <div>
                <Label htmlFor="advisor_is_active" className="text-sm text-ink">
                  Asesor activo
                </Label>
                <p className="mt-0.5 text-[0.66rem] text-stone">Se muestra en la página de mayoristas.</p>
              </div>
              <Switch
                id="advisor_is_active"
                checked={advisor_form.is_active}
                onCheckedChange={(is_active) => update_form({ is_active })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => set_dialog_open(false)}>
              Cancelar
            </Button>
            <Button onClick={handle_submit}>{editing_advisor_id ? "Guardar cambios" : "Crear asesor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
