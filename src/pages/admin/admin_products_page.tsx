import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Package, PackageSearch, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminConfirmDelete } from "@/components/admin/admin_confirm_delete";
import { normalize_admin_error } from "@/components/admin/admin_error";
import { AdminFormField } from "@/components/admin/admin_form_field";
import { AdminImageGalleryField } from "@/components/admin/admin_image_gallery_field";
import { AdminPageHeader } from "@/components/admin/admin_page_header";
import { AdminStatusBadge } from "@/components/admin/admin_status_badge";
import { EmptyState } from "@/components/shared/empty_state";
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
import { Textarea } from "@/components/ui/textarea";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import type { FieldErrorMap, ProductInput, VesuvianaProduct } from "@/core/types/vesuviana_domain_types";

type ProductStatusFilter = "all" | "active" | "inactive";

const build_empty_product_input = (brand_id: string, category_id: string): ProductInput => ({
  brand_id,
  category_id,
  product_name: "",
  product_description: "",
  product_benefits: [""],
  image_urls: [],
  is_featured: false,
  is_active: true
});

export function AdminProductsPage() {
  const { site_state, create_product, update_product, delete_product } = use_vesuviana_app();
  const [search_query, set_search_query] = useState("");
  const [brand_filter, set_brand_filter] = useState("all");
  const [category_filter, set_category_filter] = useState("all");
  const [status_filter, set_status_filter] = useState<ProductStatusFilter>("all");
  const [dialog_open, set_dialog_open] = useState(false);
  const [editing_product_id, set_editing_product_id] = useState<string | null>(null);
  const [product_form, set_product_form] = useState<ProductInput>(build_empty_product_input("", ""));
  const [field_errors, set_field_errors] = useState<FieldErrorMap>({});

  const sorted_brands = site_state.brands.slice().sort((a, b) => a.sort_order - b.sort_order);
  const form_categories = site_state.categories
    .filter((category_item) => category_item.brand_id === product_form.brand_id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const filter_categories = site_state.categories
    .filter((category_item) => brand_filter === "all" || category_item.brand_id === brand_filter)
    .sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    if (category_filter !== "all" && !filter_categories.some((category_item) => category_item.category_id === category_filter)) {
      set_category_filter("all");
    }
  }, [category_filter, filter_categories]);

  const filtered_products = useMemo(() => {
    const normalized_query = search_query.trim().toLowerCase();
    return site_state.products
      .filter((product_item) => {
        if (brand_filter !== "all" && product_item.brand_id !== brand_filter) {
          return false;
        }
        if (category_filter !== "all" && product_item.category_id !== category_filter) {
          return false;
        }
        if (status_filter === "active" && !product_item.is_active) {
          return false;
        }
        if (status_filter === "inactive" && product_item.is_active) {
          return false;
        }
        if (!normalized_query) {
          return true;
        }
        const brand = site_state.brands.find((brand_item) => brand_item.brand_id === product_item.brand_id);
        const category = site_state.categories.find((category_item) => category_item.category_id === product_item.category_id);
        return [product_item.product_name, brand?.brand_name, category?.category_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalized_query);
      })
      .sort((a, b) => a.product_name.localeCompare(b.product_name, "es"));
  }, [site_state.products, site_state.brands, site_state.categories, search_query, brand_filter, category_filter, status_filter]);

  const open_create_dialog = () => {
    const default_brand = sorted_brands.find((brand_item) => brand_item.is_active) || sorted_brands[0];
    const default_category = site_state.categories
      .filter((category_item) => category_item.brand_id === default_brand?.brand_id)
      .sort((a, b) => a.sort_order - b.sort_order)[0];
    set_editing_product_id(null);
    set_product_form(build_empty_product_input(default_brand?.brand_id || "", default_category?.category_id || ""));
    set_field_errors({});
    set_dialog_open(true);
  };

  const open_edit_dialog = (product_item: VesuvianaProduct) => {
    set_editing_product_id(product_item.product_id);
    set_product_form({
      brand_id: product_item.brand_id,
      category_id: product_item.category_id,
      product_name: product_item.product_name,
      product_description: product_item.product_description,
      product_benefits: product_item.product_benefits.length > 0 ? product_item.product_benefits : [""],
      image_urls: product_item.image_urls,
      is_featured: product_item.is_featured,
      is_active: product_item.is_active
    });
    set_field_errors({});
    set_dialog_open(true);
  };

  const update_form = (patch: Partial<ProductInput>) => {
    set_product_form((current_form) => ({ ...current_form, ...patch }));
  };

  const update_brand_selection = (brand_id: string) => {
    const next_categories = site_state.categories
      .filter((category_item) => category_item.brand_id === brand_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const is_current_category_valid = next_categories.some(
      (category_item) => category_item.category_id === product_form.category_id
    );
    update_form({
      brand_id,
      category_id: is_current_category_valid ? product_form.category_id : next_categories[0]?.category_id || ""
    });
  };

  const update_benefit = (benefit_index: number, benefit_value: string) => {
    update_form({
      product_benefits: product_form.product_benefits.map((benefit_item, current_index) =>
        current_index === benefit_index ? benefit_value : benefit_item
      )
    });
  };

  const add_benefit = () => {
    if (product_form.product_benefits.length >= 8) {
      return;
    }
    update_form({ product_benefits: [...product_form.product_benefits, ""] });
  };

  const remove_benefit = (benefit_index: number) => {
    if (product_form.product_benefits.length <= 1) {
      return;
    }
    update_form({
      product_benefits: product_form.product_benefits.filter((_, current_index) => current_index !== benefit_index)
    });
  };

  const handle_submit = () => {
    try {
      if (editing_product_id) {
        update_product(editing_product_id, product_form);
        toast.success("Producto actualizado", { description: "Los cambios ya están visibles en el catálogo." });
      } else {
        create_product(product_form);
        toast.success("Producto creado", { description: "El nuevo producto ya forma parte del catálogo." });
      }
      set_dialog_open(false);
      set_field_errors({});
    } catch (caught_error) {
      const normalized_error = normalize_admin_error(caught_error);
      set_field_errors(normalized_error.field_errors);
      if (Object.keys(normalized_error.field_errors).length === 0) {
        toast.error("No se pudo guardar el producto", { description: normalized_error.message });
      }
    }
  };

  const handle_delete = (product_item: VesuvianaProduct) => {
    try {
      delete_product(product_item.product_id);
      toast.success("Producto eliminado", { description: `Se retiró «${product_item.product_name}» del catálogo.` });
    } catch (caught_error) {
      toast.error("No se pudo eliminar", { description: normalize_admin_error(caught_error).message });
    }
  };

  const clear_filters = () => {
    set_search_query("");
    set_brand_filter("all");
    set_category_filter("all");
    set_status_filter("all");
  };

  const has_filters = Boolean(search_query) || brand_filter !== "all" || category_filter !== "all" || status_filter !== "all";

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Productos"
        description="Gestiona las fórmulas de las tres marcas: nombre, descripción, beneficios, fotografías y visibilidad en el catálogo."
        action={
          <Button onClick={open_create_dialog}>
            <Plus className="size-4" />
            Nuevo producto
          </Button>
        }
      />

      <div className="grid gap-3 rounded-2xl border border-line bg-cream/60 p-4 lg:grid-cols-[1fr_11rem_13rem_10rem_auto]">
        <Input
          type="search"
          value={search_query}
          onChange={(event) => set_search_query(event.target.value)}
          placeholder="Buscar producto..."
          className="h-10 rounded-full bg-white/70"
          aria-label="Buscar producto"
        />
        <Select
          value={brand_filter}
          onValueChange={(brand_id) => {
            set_brand_filter(brand_id);
            set_category_filter("all");
          }}
        >
          <SelectTrigger className="h-10 rounded-full" aria-label="Filtrar por marca">
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
        <Select value={category_filter} onValueChange={set_category_filter}>
          <SelectTrigger className="h-10 rounded-full" aria-label="Filtrar por categoría">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {filter_categories.map((category_item) => (
              <SelectItem key={category_item.category_id} value={category_item.category_id}>
                {category_item.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status_filter} onValueChange={(value) => set_status_filter(value as ProductStatusFilter)}>
          <SelectTrigger className="h-10 rounded-full" aria-label="Filtrar por estado">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Solo activos</SelectItem>
            <SelectItem value="inactive">Solo ocultos</SelectItem>
          </SelectContent>
        </Select>
        {has_filters ? (
          <Button variant="ghost" size="sm" onClick={clear_filters}>
            <X className="size-3.5" />
            Limpiar
          </Button>
        ) : (
          <span className="hidden items-center justify-end text-[0.68rem] text-stone lg:flex">
            {filtered_products.length} resultados
          </span>
        )}
      </div>

      {filtered_products.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-cream/65">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Marca / categoría</TableHead>
                <TableHead>Beneficios</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered_products.map((product_item) => {
                const brand = site_state.brands.find((brand_item) => brand_item.brand_id === product_item.brand_id);
                const category = site_state.categories.find(
                  (category_item) => category_item.category_id === product_item.category_id
                );
                return (
                  <TableRow key={product_item.product_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-sand">
                          <ImageWithFallback
                            src={product_item.image_urls[0] || ""}
                            alt={product_item.product_name}
                            className="size-full"
                            sizes="3rem"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="max-w-xs truncate font-medium text-ink">{product_item.product_name}</p>
                            {product_item.is_featured ? <Sparkles className="size-3.5 shrink-0 text-gold" /> : null}
                          </div>
                          <p className="mt-0.5 max-w-xs truncate text-[0.64rem] text-stone/60">/{product_item.product_slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-[0.76rem] text-ink">{brand?.brand_name}</p>
                      <p className="mt-0.5 text-[0.66rem] text-stone/60">{category?.category_name}</p>
                    </TableCell>
                    <TableCell className="text-[0.74rem] tabular-nums text-stone">{product_item.product_benefits.length}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <AdminStatusBadge
                          label={product_item.is_active ? "Activo" : "Oculto"}
                          tone={product_item.is_active ? "active" : "inactive"}
                        />
                        {product_item.is_featured ? <AdminStatusBadge label="Destacado" tone="gold" /> : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/catalogo/producto/${product_item.product_slug}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`Ver ${product_item.product_name} en el sitio`}
                          className="inline-flex size-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon_sm"
                          onClick={() => open_edit_dialog(product_item)}
                          aria-label={`Editar ${product_item.product_name}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <AdminConfirmDelete
                          title="Eliminar producto"
                          description={`Se eliminará «${product_item.product_name}» del catálogo. Esta acción no se puede deshacer.`}
                          on_confirm={() => handle_delete(product_item)}
                        >
                          <Button variant="ghost" size="icon_sm" aria-label={`Eliminar ${product_item.product_name}`}>
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
        </div>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No hay productos con esos filtros"
          description="Ajusta la búsqueda o la marca seleccionada. También puedes crear un producto nuevo desde cero."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {has_filters ? (
                <Button variant="outline" onClick={clear_filters}>
                  Limpiar filtros
                </Button>
              ) : null}
              <Button onClick={open_create_dialog}>
                <Plus className="size-4" />
                Nuevo producto
              </Button>
            </div>
          }
        />
      )}

      <Dialog open={dialog_open} onOpenChange={set_dialog_open}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing_product_id ? "Editar producto" : "Nuevo producto"}</DialogTitle>
            <DialogDescription>
              La ficha se publica en el catálogo cuando el producto está activo. La primera fotografía se usa como
              imagen principal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <AdminImageGalleryField
              value={product_form.image_urls}
              on_change={(image_urls) => update_form({ image_urls })}
              error={field_errors.image_urls}
              maximum_images={4}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminFormField label="Marca" html_for="product_brand" error={field_errors.brand_id} required>
                <Select value={product_form.brand_id} onValueChange={update_brand_selection}>
                  <SelectTrigger id="product_brand">
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
              <AdminFormField label="Categoría" html_for="product_category" error={field_errors.category_id} required>
                <Select
                  value={product_form.category_id}
                  onValueChange={(category_id) => update_form({ category_id })}
                  disabled={form_categories.length === 0}
                >
                  <SelectTrigger id="product_category">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {form_categories.map((category_item) => (
                      <SelectItem key={category_item.category_id} value={category_item.category_id}>
                        {category_item.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFormField>
            </div>

            <AdminFormField label="Nombre del producto" html_for="product_name" error={field_errors.product_name} required>
              <Input
                id="product_name"
                value={product_form.product_name}
                onChange={(event) => update_form({ product_name: event.target.value })}
                placeholder="Óleo Capilar Argán & Amla"
              />
            </AdminFormField>

            <AdminFormField
              label="Descripción"
              html_for="product_description"
              error={field_errors.product_description}
              hint={`${product_form.product_description.length}/1500 caracteres`}
              required
            >
              <Textarea
                id="product_description"
                rows={4}
                value={product_form.product_description}
                onChange={(event) => update_form({ product_description: event.target.value })}
                placeholder="Describe la fórmula, sus activos y el resultado que ofrece."
              />
            </AdminFormField>

            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink">Beneficios</span>
                  <p className="mt-0.5 text-[0.66rem] text-stone">Entre 1 y 8 beneficios concretos.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={add_benefit} disabled={product_form.product_benefits.length >= 8}>
                  <Plus className="size-3.5" />
                  Agregar
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {product_form.product_benefits.map((benefit_item, benefit_index) => (
                  <div key={benefit_index} className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sand text-[0.6rem] tabular-nums text-gold-deep">
                      {benefit_index + 1}
                    </span>
                    <Input
                      value={benefit_item}
                      onChange={(event) => update_benefit(benefit_index, event.target.value)}
                      placeholder="Describe un beneficio del producto"
                      aria-label={`Beneficio ${benefit_index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon_sm"
                      onClick={() => remove_benefit(benefit_index)}
                      disabled={product_form.product_benefits.length <= 1}
                      aria-label={`Quitar beneficio ${benefit_index + 1}`}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              {field_errors.product_benefits ? (
                <p className="mt-2 text-[0.72rem] leading-relaxed text-danger">{field_errors.product_benefits}</p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-line bg-sand/35 px-4 py-3">
                <div>
                  <Label htmlFor="product_is_featured" className="text-sm text-ink">
                    Producto destacado
                  </Label>
                  <p className="mt-0.5 text-[0.66rem] text-stone">Aparece en la selección de la landing.</p>
                </div>
                <Switch
                  id="product_is_featured"
                  checked={product_form.is_featured}
                  onCheckedChange={(is_featured) => update_form({ is_featured })}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-line bg-sand/35 px-4 py-3">
                <div>
                  <Label htmlFor="product_is_active" className="text-sm text-ink">
                    Producto activo
                  </Label>
                  <p className="mt-0.5 text-[0.66rem] text-stone">Visible en el catálogo público.</p>
                </div>
                <Switch
                  id="product_is_active"
                  checked={product_form.is_active}
                  onCheckedChange={(is_active) => update_form({ is_active })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => set_dialog_open(false)}>
              Cancelar
            </Button>
            <Button onClick={handle_submit}>
              <Package className="size-4" />
              {editing_product_id ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
