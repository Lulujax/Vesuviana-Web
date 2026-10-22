import { useMemo, useState } from "react";
import { ArrowUpRight, FolderTree, Layers3, Music2, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FacebookIcon, InstagramIcon } from "@/components/brand/social_icons";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import type {
  BrandInput,
  CategoryInput,
  FieldErrorMap,
  VesuvianaBrand,
  VesuvianaCategory
} from "@/core/types/vesuviana_domain_types";

type BrandTab = "brands" | "categories";

const create_empty_brand_input = (sort_order: number): BrandInput => ({
  brand_name: "",
  brand_description: "",
  image_url: "",
  instagram_url: "",
  tiktok_url: "",
  facebook_url: "",
  sort_order,
  is_active: true
});

const create_empty_category_input = (brand_id: string, sort_order: number): CategoryInput => ({
  brand_id,
  category_name: "",
  category_description: "",
  sort_order,
  is_active: true
});

export function AdminBrandsPage() {
  const {
    site_state,
    create_brand,
    update_brand,
    delete_brand,
    create_category,
    update_category,
    delete_category
  } = use_vesuviana_app();
  const [active_tab, set_active_tab] = useState<BrandTab>("brands");
  const [brand_dialog_open, set_brand_dialog_open] = useState(false);
  const [editing_brand_id, set_editing_brand_id] = useState<string | null>(null);
  const [brand_form, set_brand_form] = useState<BrandInput>(create_empty_brand_input(1));
  const [brand_errors, set_brand_errors] = useState<FieldErrorMap>({});
  const [category_dialog_open, set_category_dialog_open] = useState(false);
  const [editing_category_id, set_editing_category_id] = useState<string | null>(null);
  const [category_form, set_category_form] = useState<CategoryInput>(create_empty_category_input("", 1));
  const [category_errors, set_category_errors] = useState<FieldErrorMap>({});
  const [category_brand_filter, set_category_brand_filter] = useState("all");

  const sorted_brands = site_state.brands.slice().sort((a, b) => a.sort_order - b.sort_order);
  const sorted_categories = site_state.categories
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .filter(
      (category_item) => category_brand_filter === "all" || category_item.brand_id === category_brand_filter
    );

  const brand_product_counts = useMemo(() => {
    const count_map = new Map<string, { categories: number; products: number }>();
    site_state.brands.forEach((brand_item) => {
      count_map.set(brand_item.brand_id, {
        categories: site_state.categories.filter((category_item) => category_item.brand_id === brand_item.brand_id).length,
        products: site_state.products.filter((product_item) => product_item.brand_id === brand_item.brand_id).length
      });
    });
    return count_map;
  }, [site_state.brands, site_state.categories, site_state.products]);

  const open_create_brand = () => {
    set_editing_brand_id(null);
    set_brand_form(create_empty_brand_input(sorted_brands.length + 1));
    set_brand_errors({});
    set_brand_dialog_open(true);
  };

  const open_edit_brand = (brand_item: VesuvianaBrand) => {
    set_editing_brand_id(brand_item.brand_id);
    set_brand_form({
      brand_name: brand_item.brand_name,
      brand_description: brand_item.brand_description,
      image_url: brand_item.image_url,
      instagram_url: brand_item.instagram_url,
      tiktok_url: brand_item.tiktok_url,
      facebook_url: brand_item.facebook_url,
      sort_order: brand_item.sort_order,
      is_active: brand_item.is_active
    });
    set_brand_errors({});
    set_brand_dialog_open(true);
  };

  const submit_brand = () => {
    try {
      if (editing_brand_id) {
        update_brand(editing_brand_id, brand_form);
        toast.success("Marca actualizada", { description: "Los cambios ya están visibles en el catálogo." });
      } else {
        create_brand(brand_form);
        toast.success("Marca creada", { description: "La nueva marca ya forma parte del sitio." });
      }
      set_brand_dialog_open(false);
      set_brand_errors({});
    } catch (caught_error) {
      const normalized_error = normalize_admin_error(caught_error);
      set_brand_errors(normalized_error.field_errors);
      if (Object.keys(normalized_error.field_errors).length === 0) {
        toast.error("No se pudo guardar la marca", { description: normalized_error.message });
      }
    }
  };

  const handle_delete_brand = (brand_item: VesuvianaBrand) => {
    try {
      delete_brand(brand_item.brand_id);
      toast.success("Marca eliminada", { description: `Se retiró ${brand_item.brand_name} junto con su contenido asociado.` });
    } catch (caught_error) {
      toast.error("No se pudo eliminar", { description: normalize_admin_error(caught_error).message });
    }
  };

  const open_create_category = () => {
    const default_brand = sorted_brands.find((brand_item) => brand_item.is_active) || sorted_brands[0];
    const next_order =
      site_state.categories.filter((category_item) => category_item.brand_id === default_brand?.brand_id).length + 1;
    set_editing_category_id(null);
    set_category_form(create_empty_category_input(default_brand?.brand_id || "", next_order));
    set_category_errors({});
    set_category_dialog_open(true);
  };

  const open_edit_category = (category_item: VesuvianaCategory) => {
    set_editing_category_id(category_item.category_id);
    set_category_form({
      brand_id: category_item.brand_id,
      category_name: category_item.category_name,
      category_description: category_item.category_description,
      sort_order: category_item.sort_order,
      is_active: category_item.is_active
    });
    set_category_errors({});
    set_category_dialog_open(true);
  };

  const submit_category = () => {
    try {
      if (editing_category_id) {
        update_category(editing_category_id, category_form);
        toast.success("Categoría actualizada", { description: "Los cambios ya están visibles en el catálogo." });
      } else {
        create_category(category_form);
        toast.success("Categoría creada", { description: "La nueva categoría ya forma parte del catálogo." });
      }
      set_category_dialog_open(false);
      set_category_errors({});
    } catch (caught_error) {
      const normalized_error = normalize_admin_error(caught_error);
      set_category_errors(normalized_error.field_errors);
      if (Object.keys(normalized_error.field_errors).length === 0) {
        toast.error("No se pudo guardar la categoría", { description: normalized_error.message });
      }
    }
  };

  const handle_delete_category = (category_item: VesuvianaCategory) => {
    try {
      delete_category(category_item.category_id);
      toast.success("Categoría eliminada", { description: `Se retiró ${category_item.category_name} y sus productos asociados.` });
    } catch (caught_error) {
      toast.error("No se pudo eliminar", { description: normalize_admin_error(caught_error).message });
    }
  };

  const category_product_count = (category_id: string) =>
    site_state.products.filter((product_item) => product_item.category_id === category_id).length;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Estructura del catálogo"
        title="Marcas y categorías"
        description="Organiza las casas de Vesuviana y las categorías que agrupan sus productos. La estructura se refleja en el catálogo público."
        action={
          active_tab === "brands" ? (
            <Button onClick={open_create_brand}>
              <Plus className="size-4" />
              Nueva marca
            </Button>
          ) : (
            <Button onClick={open_create_category}>
              <Plus className="size-4" />
              Nueva categoría
            </Button>
          )
        }
      />

      <Tabs value={active_tab} onValueChange={(value) => set_active_tab(value as BrandTab)}>
        <TabsList className="h-auto flex-wrap rounded-2xl p-1">
          <TabsTrigger value="brands" className="gap-2 rounded-xl px-5 py-2.5">
            <Layers3 className="size-4" />
            Marcas
            <span className="rounded-full bg-cream/15 px-2 text-[0.62rem]">{site_state.brands.length}</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 rounded-xl px-5 py-2.5">
            <Tags className="size-4" />
            Categorías
            <span className="rounded-full bg-cream/15 px-2 text-[0.62rem]">{site_state.categories.length}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {active_tab === "brands" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {sorted_brands.map((brand_item) => {
            const counts = brand_product_counts.get(brand_item.brand_id) || { categories: 0, products: 0 };
            return (
              <article key={brand_item.brand_id} className="rounded-2xl border border-line bg-cream/65 p-5">
                <div className="flex items-start gap-4">
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                    <ImageWithFallback
                      src={brand_item.image_url}
                      alt={brand_item.brand_name}
                      className="size-full"
                      sizes="5rem"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminStatusBadge label={brand_item.is_active ? "Publicada" : "Oculta"} tone={brand_item.is_active ? "active" : "inactive"} />
                      <span className="text-[0.62rem] text-stone/55">Orden {brand_item.sort_order}</span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl leading-none text-ink">{brand_item.brand_name}</h2>
                    <p className="mt-1 text-[0.64rem] text-stone/60">/marca/{brand_item.brand_slug}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon_sm" onClick={() => open_edit_brand(brand_item)} aria-label={`Editar ${brand_item.brand_name}`}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <AdminConfirmDelete
                      title={`Eliminar ${brand_item.brand_name}`}
                      description={`Se eliminarán también ${counts.categories} categorías y ${counts.products} productos asociados a esta marca. Esta acción no se puede deshacer.`}
                      on_confirm={() => handle_delete_brand(brand_item)}
                    >
                      <Button variant="ghost" size="icon_sm" aria-label={`Eliminar ${brand_item.brand_name}`}>
                        <Trash2 className="size-3.5 text-danger" />
                      </Button>
                    </AdminConfirmDelete>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-[0.78rem] leading-relaxed text-stone">{brand_item.brand_description}</p>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-sand/40 p-3 text-center">
                  <div>
                    <p className="font-display text-xl text-ink">{counts.categories}</p>
                    <p className="text-[0.56rem] uppercase tracking-[0.08em] text-stone">Categorías</p>
                  </div>
                  <div className="border-x border-line">
                    <p className="font-display text-xl text-ink">{counts.products}</p>
                    <p className="text-[0.56rem] uppercase tracking-[0.08em] text-stone">Productos</p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-ink">{brand_item.is_active ? "Sí" : "No"}</p>
                    <p className="text-[0.56rem] uppercase tracking-[0.08em] text-stone">Visible</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-[0.64rem]">
                  {brand_item.instagram_url ? (
                    <a href={brand_item.instagram_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-stone transition-colors hover:text-gold-deep">
                      <InstagramIcon className="size-3.5" />
                      Instagram
                    </a>
                  ) : null}
                  {brand_item.tiktok_url ? (
                    <a href={brand_item.tiktok_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-stone transition-colors hover:text-gold-deep">
                      <Music2 className="size-3.5" />
                      TikTok
                    </a>
                  ) : null}
                  {brand_item.facebook_url ? (
                    <a href={brand_item.facebook_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-stone transition-colors hover:text-gold-deep">
                      <FacebookIcon className="size-3.5" />
                      Facebook
                    </a>
                  ) : null}
                  <a
                    href={`/catalogo?marca=${brand_item.brand_slug}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-auto inline-flex items-center gap-1 text-gold-deep"
                  >
                    Ver en el sitio
                    <ArrowUpRight className="size-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-cream/60 p-4">
            <div className="flex items-center gap-2">
              <FolderTree className="size-4 text-gold-deep" />
              <span className="text-[0.72rem] text-stone">Filtrar categorías por marca</span>
            </div>
            <Select value={category_brand_filter} onValueChange={set_category_brand_filter}>
              <SelectTrigger className="w-56 rounded-full" aria-label="Filtrar categorías por marca">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {sorted_brands.map((brand_item) => (
                  <SelectItem key={brand_item.brand_id} value={brand_item.brand_id}>
                    {brand_item.brand_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-cream/65">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted_categories.map((category_item) => {
                  const parent_brand = site_state.brands.find((brand_item) => brand_item.brand_id === category_item.brand_id);
                  const products_count = category_product_count(category_item.category_id);
                  return (
                    <TableRow key={category_item.category_id}>
                      <TableCell>
                        <p className="font-medium text-ink">{category_item.category_name}</p>
                        <p className="mt-0.5 max-w-xs truncate text-[0.66rem] text-stone/65">{category_item.category_description}</p>
                      </TableCell>
                      <TableCell className="text-[0.76rem] text-stone">{parent_brand?.brand_name || "Sin marca"}</TableCell>
                      <TableCell className="text-[0.76rem] tabular-nums text-stone">{products_count}</TableCell>
                      <TableCell className="text-[0.76rem] tabular-nums text-stone">{category_item.sort_order}</TableCell>
                      <TableCell>
                        <AdminStatusBadge label={category_item.is_active ? "Activa" : "Oculta"} tone={category_item.is_active ? "active" : "inactive"} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon_sm" onClick={() => open_edit_category(category_item)} aria-label={`Editar ${category_item.category_name}`}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <AdminConfirmDelete
                            title={`Eliminar ${category_item.category_name}`}
                            description={`Se eliminarán también ${products_count} productos asociados a esta categoría. Esta acción no se puede deshacer.`}
                            on_confirm={() => handle_delete_category(category_item)}
                          >
                            <Button variant="ghost" size="icon_sm" aria-label={`Eliminar ${category_item.category_name}`}>
                              <Trash2 className="size-3.5 text-danger" />
                            </Button>
                          </AdminConfirmDelete>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {sorted_categories.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Tags className="mx-auto size-7 text-gold-deep/50" />
                <p className="mt-3 font-display text-2xl text-ink">No hay categorías con ese filtro</p>
                <p className="mt-1 text-sm text-stone">Cambia la marca seleccionada o crea una nueva categoría.</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <Dialog open={brand_dialog_open} onOpenChange={set_brand_dialog_open}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing_brand_id ? "Editar marca" : "Nueva marca"}</DialogTitle>
            <DialogDescription>
              La marca aparecerá en la landing, el catálogo y el pie de página cuando esté publicada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <AdminImageField
              asset_kind="brand"
              label="Imagen de la marca"
              value={brand_form.image_url}
              on_change={(image_url) => set_brand_form((current_form) => ({ ...current_form, image_url }))}
              error={brand_errors.image_url}
            />

            <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
              <AdminFormField label="Nombre" html_for="brand_name" error={brand_errors.brand_name} required>
                <Input
                  id="brand_name"
                  value={brand_form.brand_name}
                  onChange={(event) => set_brand_form((current_form) => ({ ...current_form, brand_name: event.target.value }))}
                  placeholder="Defile"
                />
              </AdminFormField>
              <AdminFormField label="Orden" html_for="brand_sort_order" error={brand_errors.sort_order} required>
                <Input
                  id="brand_sort_order"
                  type="number"
                  min={1}
                  value={brand_form.sort_order}
                  onChange={(event) => set_brand_form((current_form) => ({ ...current_form, sort_order: Number(event.target.value) }))}
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Descripción" html_for="brand_description" error={brand_errors.brand_description} required>
              <Textarea
                id="brand_description"
                rows={3}
                value={brand_form.brand_description}
                onChange={(event) => set_brand_form((current_form) => ({ ...current_form, brand_description: event.target.value }))}
                placeholder="Describe el posicionamiento y la promesa de la marca."
              />
            </AdminFormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <AdminFormField label="Instagram" html_for="brand_instagram" error={brand_errors.instagram_url}>
                <Input
                  id="brand_instagram"
                  value={brand_form.instagram_url}
                  onChange={(event) => set_brand_form((current_form) => ({ ...current_form, instagram_url: event.target.value }))}
                  placeholder="https://instagram.com/..."
                />
              </AdminFormField>
              <AdminFormField label="TikTok" html_for="brand_tiktok" error={brand_errors.tiktok_url}>
                <Input
                  id="brand_tiktok"
                  value={brand_form.tiktok_url}
                  onChange={(event) => set_brand_form((current_form) => ({ ...current_form, tiktok_url: event.target.value }))}
                  placeholder="https://tiktok.com/@..."
                />
              </AdminFormField>
              <AdminFormField label="Facebook" html_for="brand_facebook" error={brand_errors.facebook_url}>
                <Input
                  id="brand_facebook"
                  value={brand_form.facebook_url}
                  onChange={(event) => set_brand_form((current_form) => ({ ...current_form, facebook_url: event.target.value }))}
                  placeholder="https://facebook.com/..."
                />
              </AdminFormField>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-line bg-sand/35 px-4 py-3">
              <div>
                <Label htmlFor="brand_is_active" className="text-sm text-ink">
                  Marca publicada
                </Label>
                <p className="mt-0.5 text-[0.68rem] text-stone">Al desactivarla, deja de mostrarse en el catálogo público.</p>
              </div>
              <Switch
                id="brand_is_active"
                checked={brand_form.is_active}
                onCheckedChange={(is_active) => set_brand_form((current_form) => ({ ...current_form, is_active }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => set_brand_dialog_open(false)}>
              Cancelar
            </Button>
            <Button onClick={submit_brand}>{editing_brand_id ? "Guardar cambios" : "Crear marca"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={category_dialog_open} onOpenChange={set_category_dialog_open}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing_category_id ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
            <DialogDescription>
              Las categorías organizan los productos dentro de cada marca y aparecen como filtros en el catálogo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <AdminFormField label="Marca" html_for="category_brand" error={category_errors.brand_id} required>
              <Select
                value={category_form.brand_id}
                onValueChange={(brand_id) => set_category_form((current_form) => ({ ...current_form, brand_id }))}
              >
                <SelectTrigger id="category_brand">
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  {sorted_brands.map((brand_item) => (
                    <SelectItem key={brand_item.brand_id} value={brand_item.brand_id}>
                      {brand_item.brand_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFormField>

            <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
              <AdminFormField label="Nombre" html_for="category_name" error={category_errors.category_name} required>
                <Input
                  id="category_name"
                  value={category_form.category_name}
                  onChange={(event) => set_category_form((current_form) => ({ ...current_form, category_name: event.target.value }))}
                  placeholder="Tratamientos capilares"
                />
              </AdminFormField>
              <AdminFormField label="Orden" html_for="category_sort_order" error={category_errors.sort_order} required>
                <Input
                  id="category_sort_order"
                  type="number"
                  min={1}
                  value={category_form.sort_order}
                  onChange={(event) => set_category_form((current_form) => ({ ...current_form, sort_order: Number(event.target.value) }))}
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Descripción" html_for="category_description" error={category_errors.category_description} required>
              <Textarea
                id="category_description"
                rows={3}
                value={category_form.category_description}
                onChange={(event) => set_category_form((current_form) => ({ ...current_form, category_description: event.target.value }))}
                placeholder="Describe qué tipo de productos agrupa esta categoría."
              />
            </AdminFormField>

            <div className="flex items-center justify-between rounded-xl border border-line bg-sand/35 px-4 py-3">
              <div>
                <Label htmlFor="category_is_active" className="text-sm text-ink">
                  Categoría visible
                </Label>
                <p className="mt-0.5 text-[0.68rem] text-stone">Se oculta del catálogo sin eliminar sus productos.</p>
              </div>
              <Switch
                id="category_is_active"
                checked={category_form.is_active}
                onCheckedChange={(is_active) => set_category_form((current_form) => ({ ...current_form, is_active }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => set_category_dialog_open(false)}>
              Cancelar
            </Button>
            <Button onClick={submit_category}>{editing_category_id ? "Guardar cambios" : "Crear categoría"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
