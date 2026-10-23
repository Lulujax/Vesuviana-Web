import type {
  AdvisorInput,
  BrandInput,
  CategoryInput,
  DistributorInput,
  ModeratorInput,
  MutationAuditInput,
  ProductInput,
  SlideInput,
  VesuvianaBrand,
  VesuvianaCarouselSlide,
  VesuvianaCategory,
  VesuvianaProduct,
  VesuvianaSiteState,
  WholesaleAdvisor
} from "@/core/types/vesuviana_domain_types";
import {
  VesuvianaAuthorizationException,
  VesuvianaConflictException,
  VesuvianaNotFoundException
} from "@/core/exceptions/vesuviana_domain_exceptions";
import { create_identifier } from "@/core/services/identifier_service";
import { create_unique_slug } from "@/core/services/slug_service";

export interface StateMutationResult {
  next_state: VesuvianaSiteState;
  audit_input: MutationAuditInput;
}

const normalize_slide_order = (slides: VesuvianaCarouselSlide[]): VesuvianaCarouselSlide[] =>
  slides
    .slice()
    .sort((first_slide, second_slide) => first_slide.sort_order - second_slide.sort_order)
    .map((slide_item, index) => ({ ...slide_item, sort_order: index + 1 }));

const normalize_category_order = (categories: VesuvianaCategory[]): VesuvianaCategory[] =>
  categories
    .slice()
    .sort((first_category, second_category) => first_category.sort_order - second_category.sort_order)
    .map((category_item, index) => ({ ...category_item, sort_order: index + 1 }));

const update_state_timestamp = (state: VesuvianaSiteState): VesuvianaSiteState => ({
  ...state,
  last_updated_at: new Date().toISOString()
});

const assert_active_general_manager = (advisors: WholesaleAdvisor[]) => {
  const active_general_manager = advisors.find(
    (advisor_item) => advisor_item.is_general_manager && advisor_item.is_active
  );
  if (!active_general_manager) {
    throw new VesuvianaConflictException(
      "Debe existir un Asesor en Jefe activo para atender los estados sin cobertura."
    );
  }
};

export function create_slide_mutation(state: VesuvianaSiteState, input: SlideInput): StateMutationResult {
  const timestamp = new Date().toISOString();
  const new_slide: VesuvianaCarouselSlide = {
    slide_id: create_identifier("slide"),
    ...input,
    created_at: timestamp,
    updated_at: timestamp
  };
  const next_slides = normalize_slide_order([...state.carousel_slides, new_slide]);
  return {
    next_state: update_state_timestamp({ ...state, carousel_slides: next_slides }),
    audit_input: {
      action_type: "CREATE",
      module_name: "CARRUSEL",
      change_summary: `Creó la diapositiva «${new_slide.slide_title}» en la portada.`
    }
  };
}

export function update_slide_mutation(
  state: VesuvianaSiteState,
  slide_id: string,
  input: SlideInput
): StateMutationResult {
  const existing_slide = state.carousel_slides.find((slide_item) => slide_item.slide_id === slide_id);
  if (!existing_slide) {
    throw new VesuvianaNotFoundException("No encontramos la diapositiva solicitada.");
  }
  const next_slides = normalize_slide_order(
    state.carousel_slides.map((slide_item) =>
      slide_item.slide_id === slide_id
        ? { ...slide_item, ...input, updated_at: new Date().toISOString() }
        : slide_item
    )
  );
  return {
    next_state: update_state_timestamp({ ...state, carousel_slides: next_slides }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "CARRUSEL",
      change_summary: `Actualizó la diapositiva «${input.slide_title}» de la portada.`
    }
  };
}

export function delete_slide_mutation(state: VesuvianaSiteState, slide_id: string): StateMutationResult {
  const existing_slide = state.carousel_slides.find((slide_item) => slide_item.slide_id === slide_id);
  if (!existing_slide) {
    throw new VesuvianaNotFoundException("No encontramos la diapositiva solicitada.");
  }
  const next_slides = normalize_slide_order(
    state.carousel_slides.filter((slide_item) => slide_item.slide_id !== slide_id)
  );
  return {
    next_state: update_state_timestamp({ ...state, carousel_slides: next_slides }),
    audit_input: {
      action_type: "DELETE",
      module_name: "CARRUSEL",
      change_summary: `Eliminó la diapositiva «${existing_slide.slide_title}» de la portada.`
    }
  };
}

export function move_slide_mutation(
  state: VesuvianaSiteState,
  slide_id: string,
  direction: "up" | "down"
): StateMutationResult {
  const sorted_slides = normalize_slide_order(state.carousel_slides);
  const current_index = sorted_slides.findIndex((slide_item) => slide_item.slide_id === slide_id);
  if (current_index === -1) {
    throw new VesuvianaNotFoundException("No encontramos la diapositiva solicitada.");
  }
  const target_index = direction === "up" ? current_index - 1 : current_index + 1;
  if (target_index < 0 || target_index >= sorted_slides.length) {
    throw new VesuvianaConflictException("La diapositiva ya se encuentra en el extremo de la portada.");
  }
  const reordered_slides = sorted_slides.slice();
  const [moved_slide] = reordered_slides.splice(current_index, 1);
  reordered_slides.splice(target_index, 0, moved_slide);
  const next_slides = normalize_slide_order(reordered_slides);
  const slide_title = sorted_slides[current_index].slide_title;
  return {
    next_state: update_state_timestamp({ ...state, carousel_slides: next_slides }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "CARRUSEL",
      change_summary: `Reordenó la diapositiva «${slide_title}» hacia ${direction === "up" ? "arriba" : "abajo"}.`
    }
  };
}

export function create_brand_mutation(state: VesuvianaSiteState, input: BrandInput): StateMutationResult {
  const timestamp = new Date().toISOString();
  const new_brand: VesuvianaBrand = {
    brand_id: create_identifier("brand"),
    brand_slug: create_unique_slug(input.brand_name, state.brands.map((brand_item) => brand_item.brand_slug), "marca"),
    ...input,
    created_at: timestamp,
    updated_at: timestamp
  };
  return {
    next_state: update_state_timestamp({ ...state, brands: [...state.brands, new_brand] }),
    audit_input: {
      action_type: "CREATE",
      module_name: "MARCAS",
      change_summary: `Creó la marca «${new_brand.brand_name}».`
    }
  };
}

export function update_brand_mutation(
  state: VesuvianaSiteState,
  brand_id: string,
  input: BrandInput
): StateMutationResult {
  const existing_brand = state.brands.find((brand_item) => brand_item.brand_id === brand_id);
  if (!existing_brand) {
    throw new VesuvianaNotFoundException("No encontramos la marca solicitada.");
  }
  const next_brands = state.brands.map((brand_item) =>
    brand_item.brand_id === brand_id
      ? { ...brand_item, ...input, updated_at: new Date().toISOString() }
      : brand_item
  );
  return {
    next_state: update_state_timestamp({ ...state, brands: next_brands }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "MARCAS",
      change_summary: `Actualizó la marca «${input.brand_name}».`
    }
  };
}

export function delete_brand_mutation(state: VesuvianaSiteState, brand_id: string): StateMutationResult {
  const existing_brand = state.brands.find((brand_item) => brand_item.brand_id === brand_id);
  if (!existing_brand) {
    throw new VesuvianaNotFoundException("No encontramos la marca solicitada.");
  }
  const removed_categories = state.categories.filter((category_item) => category_item.brand_id === brand_id);
  const removed_category_ids = new Set(removed_categories.map((category_item) => category_item.category_id));
  const removed_products = state.products.filter(
    (product_item) => product_item.brand_id === brand_id || removed_category_ids.has(product_item.category_id)
  );
  const next_state = update_state_timestamp({
    ...state,
    brands: state.brands.filter((brand_item) => brand_item.brand_id !== brand_id),
    categories: state.categories.filter((category_item) => category_item.brand_id !== brand_id),
    products: state.products.filter(
      (product_item) => product_item.brand_id !== brand_id && !removed_category_ids.has(product_item.category_id)
    )
  });
  return {
    next_state,
    audit_input: {
      action_type: "DELETE",
      module_name: "MARCAS",
      change_summary: `Eliminó la marca «${existing_brand.brand_name}» junto con ${removed_categories.length} categorías y ${removed_products.length} productos.`
    }
  };
}

export function create_category_mutation(state: VesuvianaSiteState, input: CategoryInput): StateMutationResult {
  const parent_brand = state.brands.find((brand_item) => brand_item.brand_id === input.brand_id);
  if (!parent_brand) {
    throw new VesuvianaNotFoundException("La marca seleccionada no existe.");
  }
  const timestamp = new Date().toISOString();
  const new_category: VesuvianaCategory = {
    category_id: create_identifier("category"),
    category_slug: create_unique_slug(
      `${parent_brand.brand_slug}-${input.category_name}`,
      state.categories.map((category_item) => category_item.category_slug),
      "categoria"
    ),
    ...input,
    created_at: timestamp,
    updated_at: timestamp
  };
  return {
    next_state: update_state_timestamp({
      ...state,
      categories: normalize_category_order([...state.categories, new_category])
    }),
    audit_input: {
      action_type: "CREATE",
      module_name: "CATEGORIAS",
      change_summary: `Creó la categoría «${new_category.category_name}» dentro de ${parent_brand.brand_name}.`
    }
  };
}

export function update_category_mutation(
  state: VesuvianaSiteState,
  category_id: string,
  input: CategoryInput
): StateMutationResult {
  const existing_category = state.categories.find((category_item) => category_item.category_id === category_id);
  if (!existing_category) {
    throw new VesuvianaNotFoundException("No encontramos la categoría solicitada.");
  }
  const next_categories = state.categories.map((category_item) =>
    category_item.category_id === category_id
      ? { ...category_item, ...input, updated_at: new Date().toISOString() }
      : category_item
  );
  return {
    next_state: update_state_timestamp({ ...state, categories: next_categories }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "CATEGORIAS",
      change_summary: `Actualizó la categoría «${input.category_name}».`
    }
  };
}

export function delete_category_mutation(state: VesuvianaSiteState, category_id: string): StateMutationResult {
  const existing_category = state.categories.find((category_item) => category_item.category_id === category_id);
  if (!existing_category) {
    throw new VesuvianaNotFoundException("No encontramos la categoría solicitada.");
  }
  const removed_products = state.products.filter((product_item) => product_item.category_id === category_id);
  const next_state = update_state_timestamp({
    ...state,
    categories: state.categories.filter((category_item) => category_item.category_id !== category_id),
    products: state.products.filter((product_item) => product_item.category_id !== category_id)
  });
  return {
    next_state,
    audit_input: {
      action_type: "DELETE",
      module_name: "CATEGORIAS",
      change_summary: `Eliminó la categoría «${existing_category.category_name}» junto con ${removed_products.length} productos.`
    }
  };
}

export function create_product_mutation(state: VesuvianaSiteState, input: ProductInput): StateMutationResult {
  const parent_brand = state.brands.find((brand_item) => brand_item.brand_id === input.brand_id);
  const parent_category = state.categories.find((category_item) => category_item.category_id === input.category_id);
  if (!parent_brand || !parent_category) {
    throw new VesuvianaNotFoundException("La marca o categoría seleccionada no existe.");
  }
  const timestamp = new Date().toISOString();
  const new_product: VesuvianaProduct = {
    product_id: create_identifier("product"),
    product_slug: create_unique_slug(
      input.product_name,
      state.products.map((product_item) => product_item.product_slug),
      "producto"
    ),
    ...input,
    product_benefits: input.product_benefits.map((benefit_item) => benefit_item.trim()).filter(Boolean),
    image_urls: input.image_urls.map((image_url) => image_url.trim()).filter(Boolean),
    created_at: timestamp,
    updated_at: timestamp
  };
  return {
    next_state: update_state_timestamp({ ...state, products: [...state.products, new_product] }),
    audit_input: {
      action_type: "CREATE",
      module_name: "PRODUCTOS",
      change_summary: `Creó el producto «${new_product.product_name}» de ${parent_brand.brand_name} en ${parent_category.category_name}.`
    }
  };
}

export function update_product_mutation(
  state: VesuvianaSiteState,
  product_id: string,
  input: ProductInput
): StateMutationResult {
  const existing_product = state.products.find((product_item) => product_item.product_id === product_id);
  if (!existing_product) {
    throw new VesuvianaNotFoundException("No encontramos el producto solicitado.");
  }
  const parent_brand = state.brands.find((brand_item) => brand_item.brand_id === input.brand_id);
  const next_products = state.products.map((product_item) =>
    product_item.product_id === product_id
      ? {
          ...product_item,
          ...input,
          product_benefits: input.product_benefits.map((benefit_item) => benefit_item.trim()).filter(Boolean),
          image_urls: input.image_urls.map((image_url) => image_url.trim()).filter(Boolean),
          updated_at: new Date().toISOString()
        }
      : product_item
  );
  return {
    next_state: update_state_timestamp({ ...state, products: next_products }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "PRODUCTOS",
      change_summary: `Actualizó el producto «${input.product_name}»${parent_brand ? ` de ${parent_brand.brand_name}` : ""}.`
    }
  };
}

export function delete_product_mutation(state: VesuvianaSiteState, product_id: string): StateMutationResult {
  const existing_product = state.products.find((product_item) => product_item.product_id === product_id);
  if (!existing_product) {
    throw new VesuvianaNotFoundException("No encontramos el producto solicitado.");
  }
  return {
    next_state: update_state_timestamp({
      ...state,
      products: state.products.filter((product_item) => product_item.product_id !== product_id)
    }),
    audit_input: {
      action_type: "DELETE",
      module_name: "PRODUCTOS",
      change_summary: `Eliminó el producto «${existing_product.product_name}».`
    }
  };
}

export function create_advisor_mutation(state: VesuvianaSiteState, input: AdvisorInput): StateMutationResult {
  const timestamp = new Date().toISOString();
  const new_advisor: WholesaleAdvisor = {
    advisor_id: create_identifier("advisor"),
    ...input,
    state_name: input.is_general_manager ? "Nacional" : input.state_name,
    is_active: input.is_general_manager ? true : input.is_active,
    created_at: timestamp,
    updated_at: timestamp
  };
  const adjusted_advisors = state.wholesale_advisors.map((advisor_item) =>
    new_advisor.is_general_manager && advisor_item.is_general_manager
      ? { ...advisor_item, is_general_manager: false }
      : advisor_item
  );
  const next_advisors = [...adjusted_advisors, new_advisor];
  assert_active_general_manager(next_advisors);
  return {
    next_state: update_state_timestamp({ ...state, wholesale_advisors: next_advisors }),
    audit_input: {
      action_type: "CREATE",
      module_name: "ASESORES",
      change_summary: `Creó al asesor «${new_advisor.advisor_name}» para ${new_advisor.state_name}.`
    }
  };
}

export function update_advisor_mutation(
  state: VesuvianaSiteState,
  advisor_id: string,
  input: AdvisorInput
): StateMutationResult {
  const existing_advisor = state.wholesale_advisors.find((advisor_item) => advisor_item.advisor_id === advisor_id);
  if (!existing_advisor) {
    throw new VesuvianaNotFoundException("No encontramos al asesor solicitado.");
  }
  const adjusted_advisors = state.wholesale_advisors.map((advisor_item) => {
    if (advisor_item.advisor_id === advisor_id) {
      return {
        ...advisor_item,
        ...input,
        state_name: input.is_general_manager ? "Nacional" : input.state_name,
        is_active: input.is_general_manager ? true : input.is_active,
        updated_at: new Date().toISOString()
      };
    }
    if (input.is_general_manager && advisor_item.is_general_manager) {
      return { ...advisor_item, is_general_manager: false };
    }
    return advisor_item;
  });
  assert_active_general_manager(adjusted_advisors);
  return {
    next_state: update_state_timestamp({ ...state, wholesale_advisors: adjusted_advisors }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "ASESORES",
      change_summary: `Actualizó al asesor «${input.advisor_name}» de ${input.is_general_manager ? "Nacional" : input.state_name}.`
    }
  };
}

export function delete_advisor_mutation(state: VesuvianaSiteState, advisor_id: string): StateMutationResult {
  const existing_advisor = state.wholesale_advisors.find((advisor_item) => advisor_item.advisor_id === advisor_id);
  if (!existing_advisor) {
    throw new VesuvianaNotFoundException("No encontramos al asesor solicitado.");
  }
  const next_advisors = state.wholesale_advisors.filter((advisor_item) => advisor_item.advisor_id !== advisor_id);
  assert_active_general_manager(next_advisors);
  return {
    next_state: update_state_timestamp({ ...state, wholesale_advisors: next_advisors }),
    audit_input: {
      action_type: "DELETE",
      module_name: "ASESORES",
      change_summary: `Eliminó al asesor «${existing_advisor.advisor_name}» de ${existing_advisor.state_name}.`
    }
  };
}

export function create_distributor_mutation(state: VesuvianaSiteState, input: DistributorInput): StateMutationResult {
  const timestamp = new Date().toISOString();
  const new_distributor = {
    distributor_id: create_identifier("distributor"),
    ...input,
    instagram_handle_or_url: input.instagram_handle_or_url.trim(),
    created_at: timestamp,
    updated_at: timestamp
  };
  return {
    next_state: update_state_timestamp({
      ...state,
      distributors: [...state.distributors, new_distributor]
    }),
    audit_input: {
      action_type: "CREATE",
      module_name: "DISTRIBUIDORES",
      change_summary: `Registró la tienda «${new_distributor.store_name}» en ${new_distributor.zone_name}, ${new_distributor.state_name}.`
    }
  };
}

export function update_distributor_mutation(
  state: VesuvianaSiteState,
  distributor_id: string,
  input: DistributorInput
): StateMutationResult {
  const existing_distributor = state.distributors.find(
    (distributor_item) => distributor_item.distributor_id === distributor_id
  );
  if (!existing_distributor) {
    throw new VesuvianaNotFoundException("No encontramos la tienda solicitada.");
  }
  const next_distributors = state.distributors.map((distributor_item) =>
    distributor_item.distributor_id === distributor_id
      ? {
          ...distributor_item,
          ...input,
          instagram_handle_or_url: input.instagram_handle_or_url.trim(),
          updated_at: new Date().toISOString()
        }
      : distributor_item
  );
  return {
    next_state: update_state_timestamp({ ...state, distributors: next_distributors }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "DISTRIBUIDORES",
      change_summary: `Actualizó la tienda «${input.store_name}» en ${input.zone_name}, ${input.state_name}.`
    }
  };
}

export function delete_distributor_mutation(state: VesuvianaSiteState, distributor_id: string): StateMutationResult {
  const existing_distributor = state.distributors.find(
    (distributor_item) => distributor_item.distributor_id === distributor_id
  );
  if (!existing_distributor) {
    throw new VesuvianaNotFoundException("No encontramos la tienda solicitada.");
  }
  return {
    next_state: update_state_timestamp({
      ...state,
      distributors: state.distributors.filter(
        (distributor_item) => distributor_item.distributor_id !== distributor_id
      )
    }),
    audit_input: {
      action_type: "DELETE",
      module_name: "DISTRIBUIDORES",
      change_summary: `Eliminó la tienda «${existing_distributor.store_name}» de ${existing_distributor.state_name}.`
    }
  };
}

export function create_moderator_mutation(
  state: VesuvianaSiteState,
  input: ModeratorInput,
  password_hash: string,
  password_salt: string
): StateMutationResult {
  const timestamp = new Date().toISOString();
  const new_user = {
    user_id: create_identifier("user"),
    full_name: input.full_name.trim(),
    email: input.email.trim().toLowerCase(),
    role: "MODERATOR" as const,
    is_banned: false,
    password_hash,
    password_salt,
    created_at: timestamp,
    updated_at: timestamp
  };
  return {
    next_state: update_state_timestamp({ ...state, users: [...state.users, new_user] }),
    audit_input: {
      action_type: "CREATE",
      module_name: "USUARIOS",
      change_summary: `Creó al usuario moderador ${new_user.full_name}.`
    }
  };
}

export function reset_user_password_mutation(
  state: VesuvianaSiteState,
  user_id: string,
  password_hash: string,
  password_salt: string
): StateMutationResult {
  const target_user = state.users.find((user_item) => user_item.user_id === user_id);
  if (!target_user) {
    throw new VesuvianaNotFoundException("No encontramos al usuario solicitado.");
  }
  return {
    next_state: update_state_timestamp({
      ...state,
      users: state.users.map((user_item) =>
        user_item.user_id === user_id
          ? { ...user_item, password_hash, password_salt, updated_at: new Date().toISOString() }
          : user_item
      )
    }),
    audit_input: {
      action_type: "UPDATE",
      module_name: "USUARIOS",
      change_summary: `Restableció la contraseña de ${target_user.full_name}.`
    }
  };
}

export function set_user_ban_mutation(
  state: VesuvianaSiteState,
  target_user_id: string,
  should_be_banned: boolean
): StateMutationResult {
  const target_user = state.users.find((user_item) => user_item.user_id === target_user_id);
  if (!target_user) {
    throw new VesuvianaNotFoundException("No encontramos al usuario solicitado.");
  }
  if (target_user.role === "SUPER_ADMIN") {
    throw new VesuvianaAuthorizationException("El usuario superior no puede ser baneado.");
  }
  if (target_user.is_banned === should_be_banned) {
    throw new VesuvianaConflictException(
      should_be_banned ? "El usuario ya se encuentra suspendido." : "El usuario ya se encuentra activo."
    );
  }
  const next_users = state.users.map((user_item) =>
    user_item.user_id === target_user_id
      ? { ...user_item, is_banned: should_be_banned, updated_at: new Date().toISOString() }
      : user_item
  );
  return {
    next_state: update_state_timestamp({ ...state, users: next_users }),
    audit_input: {
      action_type: should_be_banned ? "BAN_USER" : "UNBAN_USER",
      module_name: "USUARIOS",
      change_summary: should_be_banned
        ? `Suspendió la cuenta de ${target_user.full_name}.`
        : `Reactivó la cuenta de ${target_user.full_name}.`
    }
  };
}
