import { useMemo, useState } from "react";
import { MapPin, MessageCircle, Pencil, Plus, Search, Store, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { InstagramIcon } from "@/components/brand/social_icons";
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
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_VENEZUELA_STATE, VENEZUELA_STATES } from "@/core/constants/vesuviana_constants";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { get_instagram_display_label, normalize_instagram_link } from "@/core/services/instagram_link_service";
import { format_whatsapp_display } from "@/core/services/whatsapp_link_service";
import type { AuthorizedDistributor, DistributorInput, FieldErrorMap } from "@/core/types/vesuviana_domain_types";

const build_empty_distributor_input = (): DistributorInput => ({
  store_name: "",
  state_name: DEFAULT_VENEZUELA_STATE,
  zone_name: "",
  address_line: "",
  whatsapp_number: "",
  instagram_handle_or_url: "",
  is_active: true
});

export function AdminDistributorsPage() {
  const { site_state, create_distributor, update_distributor, delete_distributor } = use_vesuviana_app();
  const [search_query, set_search_query] = useState("");
  const [state_filter, set_state_filter] = useState("all");
  const [dialog_open, set_dialog_open] = useState(false);
  const [editing_distributor_id, set_editing_distributor_id] = useState<string | null>(null);
  const [distributor_form, set_distributor_form] = useState<DistributorInput>(build_empty_distributor_input());
  const [field_errors, set_field_errors] = useState<FieldErrorMap>({});

  const sorted_distributors = site_state.distributors
    .slice()
    .sort((a, b) => a.state_name.localeCompare(b.state_name, "es") || a.store_name.localeCompare(b.store_name, "es"));
  const state_options = Array.from(new Set(site_state.distributors.map((distributor_item) => distributor_item.state_name))).sort(
    (a, b) => a.localeCompare(b, "es")
  );

  const filtered_distributors = useMemo(() => {
    const normalized_query = search_query.trim().toLowerCase();
    return sorted_distributors.filter((distributor_item) => {
      if (state_filter !== "all" && distributor_item.state_name !== state_filter) {
        return false;
      }
      if (!normalized_query) {
        return true;
      }
      return [
        distributor_item.store_name,
        distributor_item.state_name,
        distributor_item.zone_name,
        distributor_item.address_line,
        distributor_item.whatsapp_number
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized_query);
    });
  }, [sorted_distributors, search_query, state_filter]);

  const open_create_dialog = () => {
    set_editing_distributor_id(null);
    set_distributor_form(build_empty_distributor_input());
    set_field_errors({});
    set_dialog_open(true);
  };

  const open_edit_dialog = (distributor_item: AuthorizedDistributor) => {
    set_editing_distributor_id(distributor_item.distributor_id);
    set_distributor_form({
      store_name: distributor_item.store_name,
      state_name: distributor_item.state_name,
      zone_name: distributor_item.zone_name,
      address_line: distributor_item.address_line,
      whatsapp_number: distributor_item.whatsapp_number,
      instagram_handle_or_url: distributor_item.instagram_handle_or_url,
      is_active: distributor_item.is_active
    });
    set_field_errors({});
    set_dialog_open(true);
  };

  const update_form = (patch: Partial<DistributorInput>) => {
    set_distributor_form((current_form) => ({ ...current_form, ...patch }));
  };

  const handle_submit = () => {
    try {
      if (editing_distributor_id) {
        update_distributor(editing_distributor_id, distributor_form);
        toast.success("Distribuidor actualizado", { description: "Los cambios ya están visibles en el directorio." });
      } else {
        create_distributor(distributor_form);
        toast.success("Distribuidor creado", { description: "La tienda ya forma parte de la red autorizada." });
      }
      set_dialog_open(false);
      set_field_errors({});
    } catch (caught_error) {
      const normalized_error = normalize_admin_error(caught_error);
      set_field_errors(normalized_error.field_errors);
      if (Object.keys(normalized_error.field_errors).length === 0) {
        toast.error("No se pudo guardar el distribuidor", { description: normalized_error.message });
      }
    }
  };

  const handle_delete = (distributor_item: AuthorizedDistributor) => {
    try {
      delete_distributor(distributor_item.distributor_id);
      toast.success("Distribuidor eliminado", { description: `Se retiró «${distributor_item.store_name}» de la red.` });
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
        eyebrow="Red autorizada"
        title="Distribuidores"
        description="Gestiona los puntos de venta oficiales que aparecen en el directorio público. Verifica la dirección y el contacto antes de publicar."
        action={
          <Button onClick={open_create_dialog}>
            <Plus className="size-4" />
            Nuevo distribuidor
          </Button>
        }
      />

      <div className="grid gap-3 rounded-2xl border border-line bg-cream/60 p-4 sm:grid-cols-[1fr_13rem_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
          <Input
            value={search_query}
            onChange={(event) => set_search_query(event.target.value)}
            placeholder="Buscar tienda, estado, zona o dirección..."
            className="h-10 rounded-full bg-white/70 pl-10"
            aria-label="Buscar distribuidor"
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
            {filtered_distributors.length} tiendas
          </span>
        )}
      </div>

      {filtered_distributors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered_distributors.map((distributor_item) => {
            const instagram_link = normalize_instagram_link(distributor_item.instagram_handle_or_url);
            return (
              <article key={distributor_item.distributor_id} className="flex h-full flex-col rounded-2xl border border-line bg-cream/65 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-sand text-gold-deep">
                    <Store className="size-5" />
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon_sm"
                      onClick={() => open_edit_dialog(distributor_item)}
                      aria-label={`Editar ${distributor_item.store_name}`}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <AdminConfirmDelete
                      title="Eliminar distribuidor"
                      description={`Se retirará «${distributor_item.store_name}» del directorio público de distribuidores.`}
                      on_confirm={() => handle_delete(distributor_item)}
                    >
                      <Button variant="ghost" size="icon_sm" aria-label={`Eliminar ${distributor_item.store_name}`}>
                        <Trash2 className="size-3.5 text-danger" />
                      </Button>
                    </AdminConfirmDelete>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <AdminStatusBadge
                    label={distributor_item.is_active ? "Activo" : "Oculto"}
                    tone={distributor_item.is_active ? "active" : "inactive"}
                  />
                  <span className="inline-flex items-center gap-1 text-[0.62rem] text-stone">
                    <MapPin className="size-3" />
                    {distributor_item.state_name} · {distributor_item.zone_name}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl leading-tight text-ink">{distributor_item.store_name}</h2>
                <p className="mt-2 flex-1 text-[0.74rem] leading-relaxed text-stone">{distributor_item.address_line}</p>
                <div className="mt-4 space-y-1.5 border-t border-line pt-3">
                  <p className="flex items-center gap-1.5 text-[0.68rem] text-stone">
                    <MessageCircle className="size-3.5 text-gold-deep" />
                    {format_whatsapp_display(distributor_item.whatsapp_number)}
                  </p>
                  {instagram_link ? (
                    <p className="flex items-center gap-1.5 text-[0.68rem] text-stone">
                      <InstagramIcon className="size-3.5 text-gold-deep" />
                      {get_instagram_display_label(distributor_item.instagram_handle_or_url)}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No hay distribuidores con ese filtro"
          description="Ajusta la búsqueda o el estado seleccionado para encontrar la tienda que buscas."
          action={
            <Button variant="outline" onClick={clear_filters}>
              Ver todos los distribuidores
            </Button>
          }
        />
      )}

      <Dialog open={dialog_open} onOpenChange={set_dialog_open}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing_distributor_id ? "Editar distribuidor" : "Nuevo distribuidor"}</DialogTitle>
            <DialogDescription>
              Los datos se publican en el directorio. El enlace de Instagram acepta un @usuario o una URL completa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <AdminFormField label="Nombre de la tienda" html_for="distributor_store" error={field_errors.store_name} required>
              <Input
                id="distributor_store"
                value={distributor_form.store_name}
                onChange={(event) => update_form({ store_name: event.target.value })}
                placeholder="Casa Defile Valencia Centro"
              />
            </AdminFormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminFormField label="Estado" html_for="distributor_state" error={field_errors.state_name} required>
                <Select value={distributor_form.state_name} onValueChange={(state_name) => update_form({ state_name })}>
                  <SelectTrigger id="distributor_state">
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
              <AdminFormField label="Zona" html_for="distributor_zone" error={field_errors.zone_name} required>
                <Input
                  id="distributor_zone"
                  value={distributor_form.zone_name}
                  onChange={(event) => update_form({ zone_name: event.target.value })}
                  placeholder="Valencia Centro"
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Dirección" html_for="distributor_address" error={field_errors.address_line} required>
              <Textarea
                id="distributor_address"
                rows={3}
                value={distributor_form.address_line}
                onChange={(event) => update_form({ address_line: event.target.value })}
                placeholder="Avenida, centro comercial, nivel y local."
              />
            </AdminFormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminFormField label="WhatsApp" html_for="distributor_whatsapp" error={field_errors.whatsapp_number} required>
                <Input
                  id="distributor_whatsapp"
                  value={distributor_form.whatsapp_number}
                  onChange={(event) => update_form({ whatsapp_number: event.target.value })}
                  placeholder="+58 412 555 0199"
                />
              </AdminFormField>
              <AdminFormField
                label="Instagram"
                html_for="distributor_instagram"
                error={field_errors.instagram_handle_or_url}
                hint="@usuario o URL completa."
              >
                <Input
                  id="distributor_instagram"
                  value={distributor_form.instagram_handle_or_url}
                  onChange={(event) => update_form({ instagram_handle_or_url: event.target.value })}
                  placeholder="@casadefile.valencia"
                />
              </AdminFormField>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-line bg-sand/35 px-4 py-3">
              <div>
                <Label htmlFor="distributor_is_active" className="text-sm text-ink">
                  Distribuidor activo
                </Label>
                <p className="mt-0.5 text-[0.66rem] text-stone">Visible en el directorio público.</p>
              </div>
              <Switch
                id="distributor_is_active"
                checked={distributor_form.is_active}
                onCheckedChange={(is_active) => update_form({ is_active })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => set_dialog_open(false)}>
              Cancelar
            </Button>
            <Button onClick={handle_submit}>{editing_distributor_id ? "Guardar cambios" : "Crear distribuidor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
