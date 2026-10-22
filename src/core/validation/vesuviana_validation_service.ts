import type {
  AdvisorInput,
  AdminUser,
  BrandInput,
  CategoryInput,
  DistributorInput,
  FieldErrorMap,
  ModeratorInput,
  ProductInput,
  SlideInput,
  VesuvianaSiteState
} from "@/core/types/vesuviana_domain_types";
import {
  VesuvianaAuthorizationException,
  VesuvianaConflictException,
  VesuvianaValidationException
} from "@/core/exceptions/vesuviana_domain_exceptions";
import { is_valid_instagram_source } from "@/core/services/instagram_link_service";
import { is_valid_whatsapp_number } from "@/core/services/whatsapp_link_service";
import { VENEZUELA_STATES } from "@/core/constants/vesuviana_constants";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalize_text = (value: string) => value.trim().toLowerCase();

const is_valid_image_source = (value: string) =>
  /^data:image\/(png|jpe?g|webp|avif|gif);base64,/i.test(value) || /^https?:\/\/.+/i.test(value);

const get_length_error = (
  field_errors: FieldErrorMap,
  field_name: string,
  value: string,
  minimum_length: number,
  maximum_length: number,
  message: string
) => {
  const trimmed_value = value.trim();
  if (trimmed_value.length < minimum_length || trimmed_value.length > maximum_length) {
    field_errors[field_name] = message;
  }
};

const validate_social_url = (field_errors: FieldErrorMap, field_name: string, value: string, domain_name: string) => {
  const trimmed_value = value.trim();
  if (!trimmed_value) {
    return;
  }
  try {
    const parsed_url = new URL(trimmed_value);
    if (!parsed_url.hostname.toLowerCase().includes(domain_name)) {
      field_errors[field_name] = `El enlace debe pertenecer a ${domain_name}.`;
    }
  } catch {
    field_errors[field_name] = "Ingresa una URL válida que comience con https://.";
  }
};

const throw_if_errors = (field_errors: FieldErrorMap) => {
  if (Object.keys(field_errors).length > 0) {
    throw new VesuvianaValidationException("Revisa los campos marcados antes de guardar.", field_errors);
  }
};

export function validate_slide_input(input: SlideInput) {
  const field_errors: FieldErrorMap = {};
  get_length_error(field_errors, "slide_subtitle", input.slide_subtitle, 2, 90, "El subtítulo debe tener entre 2 y 90 caracteres.");
  get_length_error(field_errors, "slide_title", input.slide_title, 2, 110, "El título debe tener entre 2 y 110 caracteres.");
  get_length_error(field_errors, "slide_description", input.slide_description, 20, 340, "La descripción debe tener entre 20 y 340 caracteres.");
  get_length_error(field_errors, "cta_label", input.cta_label, 2, 40, "El texto del botón debe tener entre 2 y 40 caracteres.");
  if (!input.cta_href.trim().startsWith("/")) {
    field_errors.cta_href = "El enlace debe ser una ruta interna que comience con /.";
  }
  if (!is_valid_image_source(input.image_url.trim())) {
    field_errors.image_url = "Agrega una imagen mediante URL o archivo.";
  }
  if (!Number.isFinite(input.sort_order) || input.sort_order < 1) {
    field_errors.sort_order = "El orden debe ser un número mayor o igual a 1.";
  }
  throw_if_errors(field_errors);
}

export function validate_brand_input(input: BrandInput, state: VesuvianaSiteState, current_brand_id?: string) {
  const field_errors: FieldErrorMap = {};
  get_length_error(field_errors, "brand_name", input.brand_name, 2, 60, "El nombre de la marca debe tener entre 2 y 60 caracteres.");
  get_length_error(field_errors, "brand_description", input.brand_description, 20, 420, "La descripción debe tener entre 20 y 420 caracteres.");
  if (!is_valid_image_source(input.image_url.trim())) {
    field_errors.image_url = "Agrega una imagen de portada para la marca.";
  }
  validate_social_url(field_errors, "instagram_url", input.instagram_url, "instagram.com");
  validate_social_url(field_errors, "tiktok_url", input.tiktok_url, "tiktok.com");
  validate_social_url(field_errors, "facebook_url", input.facebook_url, "facebook.com");
  const duplicated_brand = state.brands.find(
    (brand_item) =>
      brand_item.brand_id !== current_brand_id &&
      normalize_text(brand_item.brand_name) === normalize_text(input.brand_name)
  );
  if (duplicated_brand) {
    field_errors.brand_name = "Ya existe una marca con ese nombre.";
  }
  throw_if_errors(field_errors);
}

export function validate_category_input(input: CategoryInput, state: VesuvianaSiteState, current_category_id?: string) {
  const field_errors: FieldErrorMap = {};
  if (!state.brands.some((brand_item) => brand_item.brand_id === input.brand_id)) {
    field_errors.brand_id = "Selecciona una marca válida.";
  }
  get_length_error(field_errors, "category_name", input.category_name, 2, 60, "El nombre de la categoría debe tener entre 2 y 60 caracteres.");
  get_length_error(
    field_errors,
    "category_description",
    input.category_description,
    5,
    240,
    "La descripción debe tener entre 5 y 240 caracteres."
  );
  const duplicated_category = state.categories.find(
    (category_item) =>
      category_item.category_id !== current_category_id &&
      category_item.brand_id === input.brand_id &&
      normalize_text(category_item.category_name) === normalize_text(input.category_name)
  );
  if (duplicated_category) {
    field_errors.category_name = "Esta marca ya tiene una categoría con ese nombre.";
  }
  throw_if_errors(field_errors);
}

export function validate_product_input(input: ProductInput, state: VesuvianaSiteState, current_product_id?: string) {
  const field_errors: FieldErrorMap = {};
  const brand = state.brands.find((brand_item) => brand_item.brand_id === input.brand_id);
  if (!brand) {
    field_errors.brand_id = "Selecciona una marca válida.";
  }
  const category = state.categories.find((category_item) => category_item.category_id === input.category_id);
  if (!category) {
    field_errors.category_id = "Selecciona una categoría válida.";
  } else if (brand && category.brand_id !== brand.brand_id) {
    field_errors.category_id = "La categoría debe pertenecer a la marca seleccionada.";
  }
  get_length_error(field_errors, "product_name", input.product_name, 2, 100, "El nombre del producto debe tener entre 2 y 100 caracteres.");
  get_length_error(
    field_errors,
    "product_description",
    input.product_description,
    30,
    1500,
    "La descripción debe tener entre 30 y 1500 caracteres."
  );
  const trimmed_benefits = input.product_benefits.map((benefit_item) => benefit_item.trim()).filter(Boolean);
  if (trimmed_benefits.length < 1 || trimmed_benefits.length > 8) {
    field_errors.product_benefits = "Agrega entre 1 y 8 beneficios.";
  } else if (trimmed_benefits.some((benefit_item) => benefit_item.length < 3 || benefit_item.length > 160)) {
    field_errors.product_benefits = "Cada beneficio debe tener entre 3 y 160 caracteres.";
  }
  if (input.image_urls.length < 1) {
    field_errors.image_urls = "Agrega al menos una fotografía del producto.";
  } else if (input.image_urls.length > 4) {
    field_errors.image_urls = "Puedes agregar hasta 4 fotografías por producto.";
  } else if (input.image_urls.some((image_url) => !is_valid_image_source(image_url.trim()))) {
    field_errors.image_urls = "Todas las fotografías deben ser URLs válidas o archivos de imagen.";
  }
  const duplicated_product = state.products.find(
    (product_item) =>
      product_item.product_id !== current_product_id &&
      normalize_text(product_item.product_name) === normalize_text(input.product_name)
  );
  if (duplicated_product) {
    field_errors.product_name = "Ya existe un producto con ese nombre.";
  }
  throw_if_errors(field_errors);
}

export function validate_advisor_input(input: AdvisorInput, state: VesuvianaSiteState, current_advisor_id?: string) {
  const field_errors: FieldErrorMap = {};
  get_length_error(field_errors, "advisor_name", input.advisor_name, 2, 90, "El nombre del asesor debe tener entre 2 y 90 caracteres.");
  const valid_state = input.is_general_manager
    ? input.state_name === "Nacional" || (VENEZUELA_STATES as readonly string[]).includes(input.state_name)
    : (VENEZUELA_STATES as readonly string[]).includes(input.state_name);
  if (!valid_state) {
    field_errors.state_name = "Selecciona un estado de Venezuela.";
  }
  get_length_error(field_errors, "zone_name", input.zone_name, 2, 140, "La zona debe tener entre 2 y 140 caracteres.");
  if (!is_valid_whatsapp_number(input.whatsapp_number)) {
    field_errors.whatsapp_number = "Ingresa un número de WhatsApp venezolano válido.";
  }
  const duplicated_advisor = state.wholesale_advisors.find(
    (advisor_item) =>
      advisor_item.advisor_id !== current_advisor_id &&
      normalize_text(advisor_item.advisor_name) === normalize_text(input.advisor_name) &&
      normalize_text(advisor_item.state_name) === normalize_text(input.state_name)
  );
  if (duplicated_advisor) {
    field_errors.advisor_name = "Ya existe un asesor con ese nombre en ese estado.";
  }
  throw_if_errors(field_errors);
}

export function validate_distributor_input(input: DistributorInput, state: VesuvianaSiteState, current_distributor_id?: string) {
  const field_errors: FieldErrorMap = {};
  get_length_error(field_errors, "store_name", input.store_name, 2, 90, "El nombre de la tienda debe tener entre 2 y 90 caracteres.");
  if (!(VENEZUELA_STATES as readonly string[]).includes(input.state_name)) {
    field_errors.state_name = "Selecciona un estado de Venezuela.";
  }
  get_length_error(field_errors, "zone_name", input.zone_name, 2, 100, "La zona debe tener entre 2 y 100 caracteres.");
  get_length_error(field_errors, "address_line", input.address_line, 10, 240, "La dirección debe tener entre 10 y 240 caracteres.");
  if (!is_valid_whatsapp_number(input.whatsapp_number)) {
    field_errors.whatsapp_number = "Ingresa un número de WhatsApp venezolano válido.";
  }
  if (!is_valid_instagram_source(input.instagram_handle_or_url)) {
    field_errors.instagram_handle_or_url = "Usa un @usuario o una URL de Instagram válida.";
  }
  const duplicated_distributor = state.distributors.find(
    (distributor_item) =>
      distributor_item.distributor_id !== current_distributor_id &&
      normalize_text(distributor_item.store_name) === normalize_text(input.store_name) &&
      normalize_text(distributor_item.state_name) === normalize_text(input.state_name)
  );
  if (duplicated_distributor) {
    field_errors.store_name = "Ya existe una tienda con ese nombre en ese estado.";
  }
  throw_if_errors(field_errors);
}

export function validate_moderator_input(input: ModeratorInput, state: VesuvianaSiteState) {
  const field_errors: FieldErrorMap = {};
  get_length_error(field_errors, "full_name", input.full_name, 2, 90, "El nombre debe tener entre 2 y 90 caracteres.");
  if (!EMAIL_PATTERN.test(input.email.trim())) {
    field_errors.email = "Ingresa un correo electrónico válido.";
  }
  const duplicated_user = state.users.find(
    (user_item) => normalize_text(user_item.email) === normalize_text(input.email)
  );
  if (duplicated_user) {
    field_errors.email = "Ya existe un usuario con ese correo.";
  }
  throw_if_errors(field_errors);
}

export function validate_site_state(state: VesuvianaSiteState) {
  const has_required_collections =
    Array.isArray(state.brands) &&
    Array.isArray(state.categories) &&
    Array.isArray(state.products) &&
    Array.isArray(state.carousel_slides) &&
    Array.isArray(state.wholesale_advisors) &&
    Array.isArray(state.distributors) &&
    Array.isArray(state.users) &&
    Array.isArray(state.audit_logs);
  if (!has_required_collections) {
    throw new VesuvianaValidationException("La estructura de datos del sitio está incompleta.");
  }
  const brand_ids = new Set(state.brands.map((brand_item) => brand_item.brand_id));
  const category_map = new Map(state.categories.map((category_item) => [category_item.category_id, category_item]));
  if (state.categories.some((category_item) => !brand_ids.has(category_item.brand_id))) {
    throw new VesuvianaValidationException("Existen categorías asociadas a marcas inexistentes.");
  }
  if (
    state.products.some((product_item) => {
      const category = category_map.get(product_item.category_id);
      return !category || category.brand_id !== product_item.brand_id || !brand_ids.has(product_item.brand_id);
    })
  ) {
    throw new VesuvianaValidationException("Existen productos con referencias de marca o categoría inválidas.");
  }
  if (!state.users.some((user_item) => user_item.role === "SUPER_ADMIN")) {
    throw new VesuvianaValidationException("El sitio debe conservar al menos un usuario superior.");
  }
  const brand_slugs = state.brands.map((brand_item) => brand_item.brand_slug);
  const category_slugs = state.categories.map((category_item) => category_item.category_slug);
  const product_slugs = state.products.map((product_item) => product_item.product_slug);
  if (
    new Set(brand_slugs).size !== brand_slugs.length ||
    new Set(category_slugs).size !== category_slugs.length ||
    new Set(product_slugs).size !== product_slugs.length
  ) {
    throw new VesuvianaConflictException("Existen identificadores duplicados en el contenido del sitio.");
  }
}

export function assert_can_manage_content(active_user: AdminUser) {
  if (active_user.is_banned) {
    throw new VesuvianaAuthorizationException("Tu cuenta está suspendida por el administrador principal.");
  }
  if (active_user.role !== "SUPER_ADMIN" && active_user.role !== "MODERATOR") {
    throw new VesuvianaAuthorizationException("No tienes permisos para gestionar el contenido.");
  }
}

export function assert_super_admin(active_user: AdminUser) {
  if (active_user.is_banned) {
    throw new VesuvianaAuthorizationException("Tu cuenta está suspendida por el administrador principal.");
  }
  if (active_user.role !== "SUPER_ADMIN") {
    throw new VesuvianaAuthorizationException("Esta sección está reservada al usuario superior.");
  }
}
