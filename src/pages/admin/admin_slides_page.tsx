import { useState } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminConfirmDelete } from "@/components/admin/admin_confirm_delete";
import { normalize_admin_error } from "@/components/admin/admin_error";
import { AdminFormField } from "@/components/admin/admin_form_field";
import { AdminImageField } from "@/components/admin/admin_image_field";
import { AdminPageHeader } from "@/components/admin/admin_page_header";
import { AdminStatusBadge } from "@/components/admin/admin_status_badge";
import { ImageWithFallback } from "@/components/shared/image_with_fallback";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import type { FieldErrorMap, SlideInput, VesuvianaCarouselSlide } from "@/core/types/vesuviana_domain_types";
import { format_short_date } from "@/core/services/date_format_service";

const create_empty_slide_input = (sort_order: number): SlideInput => ({
  slide_subtitle: "",
  slide_title: "",
  slide_description: "",
  cta_label: "Explorar catálogo",
  cta_href: "/catalogo",
  image_url: "",
  sort_order,
  is_active: true
});

export function AdminSlidesPage() {
  const { site_state, create_slide, update_slide, delete_slide, move_slide } = use_vesuviana_app();
  const sorted_slides = site_state.carousel_slides.slice().sort((a, b) => a.sort_order - b.sort_order);
  const [is_dialog_open, set_is_dialog_open] = useState(false);
  const [editing_slide_id, set_editing_slide_id] = useState<string | null>(null);
  const [form_state, set_form_state] = useState<SlideInput>(create_empty_slide_input(1));
  const [field_errors, set_field_errors] = useState<FieldErrorMap>({});

  const open_create_dialog = () => {
    set_editing_slide_id(null);
    set_form_state(create_empty_slide_input(sorted_slides.length + 1));
    set_field_errors({});
    set_is_dialog_open(true);
  };

  const open_edit_dialog = (slide_item: VesuvianaCarouselSlide) => {
    set_editing_slide_id(slide_item.slide_id);
    set_form_state({
      slide_subtitle: slide_item.slide_subtitle,
      slide_title: slide_item.slide_title,
      slide_description: slide_item.slide_description,
      cta_label: slide_item.cta_label,
      cta_href: slide_item.cta_href,
      image_url: slide_item.image_url,
      sort_order: slide_item.sort_order,
      is_active: slide_item.is_active
    });
    set_field_errors({});
    set_is_dialog_open(true);
  };

  const update_form = (patch: Partial<SlideInput>) => {
    set_form_state((current_form) => ({ ...current_form, ...patch }));
  };

  const handle_submit = () => {
    try {
      if (editing_slide_id) {
        update_slide(editing_slide_id, form_state);
        toast.success("Diapositiva actualizada", { description: "Los cambios ya están visibles en la portada." });
      } else {
        create_slide(form_state);
        toast.success("Diapositiva creada", { description: "La portada ya incluye el nuevo slide." });
      }
      set_is_dialog_open(false);
      set_field_errors({});
    } catch (caught_error) {
      const normalized_error = normalize_admin_error(caught_error);
      set_field_errors(normalized_error.field_errors);
      if (Object.keys(normalized_error.field_errors).length === 0) {
        toast.error("No se pudo guardar la diapositiva", { description: normalized_error.message });
      }
    }
  };

  const handle_delete = (slide_item: VesuvianaCarouselSlide) => {
    try {
      delete_slide(slide_item.slide_id);
      toast.success("Diapositiva eliminada", { description: `Se retiró «${slide_item.slide_title}» de la portada.` });
    } catch (caught_error) {
      toast.error("No se pudo eliminar", { description: normalize_admin_error(caught_error).message });
    }
  };

  const handle_move = (slide_item: VesuvianaCarouselSlide, direction: "up" | "down") => {
    try {
      move_slide(slide_item.slide_id, direction);
    } catch (caught_error) {
      toast.error("No se pudo reordenar", { description: normalize_admin_error(caught_error).message });
    }
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Contenido de portada"
        title="Carrusel"
        description="Controla los slides que reciben a tus visitantes. El orden, el texto y la imagen se actualizan en la portada del sitio público."
        action={
          <Button onClick={open_create_dialog}>
            <Plus className="size-4" />
            Nueva diapositiva
          </Button>
        }
      />

      <div className="grid gap-3 rounded-2xl border border-line bg-cream/60 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-sand text-gold-deep">
          <ImageIcon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Formato recomendado: 1920 × 1080 px</p>
          <p className="mt-0.5 text-[0.74rem] leading-relaxed text-stone">
            Las imágenes se recortan de forma centrada para mantener la proporción panorámica sin estirarse. Las URLs
            remotas conservan su archivo original.
          </p>
        </div>
        <AdminStatusBadge label={`${sorted_slides.filter((slide_item) => slide_item.is_active).length} activos`} tone="active" />
      </div>

      {sorted_slides.length > 0 ? (
        <div className="space-y-3">
          {sorted_slides.map((slide_item, slide_index) => (
            <article
              key={slide_item.slide_id}
              className="grid gap-4 rounded-2xl border border-line bg-cream/65 p-4 sm:grid-cols-[13rem_1fr_auto] sm:items-center"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-sand">
                <ImageWithFallback
                  src={slide_item.image_url}
                  alt={slide_item.slide_title}
                  className="size-full"
                  sizes="13rem"
                />
                <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[0.55rem] font-medium text-cream backdrop-blur">
                  0{slide_index + 1}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <AdminStatusBadge label={slide_item.is_active ? "Publicado" : "Oculto"} tone={slide_item.is_active ? "active" : "inactive"} />
                  <span className="text-[0.62rem] text-stone/60">Actualizado {format_short_date(slide_item.updated_at)}</span>
                </div>
                <h2 className="mt-2 truncate font-display text-2xl leading-tight text-ink">{slide_item.slide_title}</h2>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.1em] text-gold-deep">{slide_item.slide_subtitle}</p>
                <p className="mt-2 line-clamp-2 text-[0.76rem] leading-relaxed text-stone">{slide_item.slide_description}</p>
                <p className="mt-2 text-[0.66rem] text-stone/60">
                  CTA: {slide_item.cta_label} → {slide_item.cta_href}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:flex-col sm:items-end">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon_sm"
                    onClick={() => handle_move(slide_item, "up")}
                    disabled={slide_index === 0}
                    aria-label={`Mover ${slide_item.slide_title} hacia arriba`}
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon_sm"
                    onClick={() => handle_move(slide_item, "down")}
                    disabled={slide_index === sorted_slides.length - 1}
                    aria-label={`Mover ${slide_item.slide_title} hacia abajo`}
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => open_edit_dialog(slide_item)}>
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                  <AdminConfirmDelete
                    title="Eliminar diapositiva"
                    description={`Se eliminará «${slide_item.slide_title}» de la portada. Esta acción no se puede deshacer.`}
                    on_confirm={() => handle_delete(slide_item)}
                  >
                    <Button variant="ghost" size="icon_sm" aria-label={`Eliminar ${slide_item.slide_title}`}>
                      <Trash2 className="size-3.5 text-danger" />
                    </Button>
                  </AdminConfirmDelete>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-cream/50 py-16 text-center">
          <ImageIcon className="mx-auto size-8 text-gold-deep/50" />
          <h2 className="mt-4 font-display text-2xl text-ink">La portada está vacía</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone">
            Crea la primera diapositiva para que el carrusel vuelva a mostrarse en el sitio público.
          </p>
          <Button className="mt-5" onClick={open_create_dialog}>
            <Plus className="size-4" />
            Crear diapositiva
          </Button>
        </div>
      )}

      <Dialog open={is_dialog_open} onOpenChange={set_is_dialog_open}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing_slide_id ? "Editar diapositiva" : "Nueva diapositiva"}</DialogTitle>
            <DialogDescription>
              {editing_slide_id
                ? "Actualiza el contenido del slide. Los cambios se aplican al guardar."
                : "Completa la información del nuevo slide de portada."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <AdminImageField
              asset_kind="slide"
              label="Imagen de portada"
              value={form_state.image_url}
              on_change={(image_url) => update_form({ image_url })}
              error={field_errors.image_url}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminFormField label="Subtítulo" html_for="slide_subtitle" error={field_errors.slide_subtitle} required>
                <Input
                  id="slide_subtitle"
                  value={form_state.slide_subtitle}
                  onChange={(event) => update_form({ slide_subtitle: event.target.value })}
                  placeholder="Defile · Línea profesional"
                />
              </AdminFormField>
              <AdminFormField label="Orden" html_for="slide_sort_order" error={field_errors.sort_order} required>
                <Input
                  id="slide_sort_order"
                  type="number"
                  min={1}
                  value={form_state.sort_order}
                  onChange={(event) => update_form({ sort_order: Number(event.target.value) })}
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Título" html_for="slide_title" error={field_errors.slide_title} required>
              <Input
                id="slide_title"
                value={form_state.slide_title}
                onChange={(event) => update_form({ slide_title: event.target.value })}
                placeholder="El lujo de cuidar tu cabello"
              />
            </AdminFormField>

            <AdminFormField label="Descripción" html_for="slide_description" error={field_errors.slide_description} required>
              <Textarea
                id="slide_description"
                rows={3}
                value={form_state.slide_description}
                onChange={(event) => update_form({ slide_description: event.target.value })}
                placeholder="Describe la colección o el mensaje principal de esta diapositiva."
              />
            </AdminFormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminFormField label="Texto del botón" html_for="slide_cta_label" error={field_errors.cta_label} required>
                <Input
                  id="slide_cta_label"
                  value={form_state.cta_label}
                  onChange={(event) => update_form({ cta_label: event.target.value })}
                  placeholder="Explorar catálogo"
                />
              </AdminFormField>
              <AdminFormField
                label="Enlace del botón"
                html_for="slide_cta_href"
                error={field_errors.cta_href}
                hint="Ruta interna, por ejemplo /catalogo?marca=defile."
                required
              >
                <Input
                  id="slide_cta_href"
                  value={form_state.cta_href}
                  onChange={(event) => update_form({ cta_href: event.target.value })}
                  placeholder="/catalogo"
                />
              </AdminFormField>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-line bg-sand/35 px-4 py-3">
              <div>
                <Label htmlFor="slide_is_active" className="text-sm text-ink">
                  Visible en la portada
                </Label>
                <p className="mt-0.5 text-[0.68rem] text-stone">Si se desactiva, el slide se conserva pero no se muestra.</p>
              </div>
              <Switch
                id="slide_is_active"
                checked={form_state.is_active}
                onCheckedChange={(is_active) => update_form({ is_active })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => set_is_dialog_open(false)}>
              Cancelar
            </Button>
            <Button onClick={handle_submit}>{editing_slide_id ? "Guardar cambios" : "Crear diapositiva"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
