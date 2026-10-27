import type {
  AdminUser,
  AuditLogEntry,
  AuthorizedDistributor,
  VesuvianaBrand,
  VesuvianaCarouselSlide,
  VesuvianaCategory,
  VesuvianaProduct,
  VesuvianaSiteState,
  WholesaleAdvisor
} from "@/core/types/vesuviana_domain_types";
import { CURRENT_SCHEMA_VERSION, CURRENT_SEED_VERSION } from "@/core/constants/vesuviana_constants";
import { VESUVIANA_MEDIA } from "@/core/data/vesuviana_media";

const seeded_at = "2026-09-15T12:00:00.000Z";

const create_product = (
  product_id: string,
  brand_id: string,
  category_id: string,
  product_name: string,
  product_description: string,
  product_benefits: string[],
  image_urls: string[],
  is_featured: boolean
): VesuvianaProduct => ({
  product_id,
  product_slug: product_id.replace(/^product_/, "").replaceAll("_", "-"),
  brand_id,
  category_id,
  product_name,
  product_description,
  product_benefits,
  image_urls,
  is_featured,
  is_active: true,
  created_at: seeded_at,
  updated_at: seeded_at
});

export const VESUVIANA_INITIAL_BRANDS: VesuvianaBrand[] = [
  {
    brand_id: "brand_defile",
    brand_slug: "defile",
    brand_name: "Defile",
    brand_description:
      "Tratamientos profesionales para el cabello. Ampollas, mascarillas y cremas de acabado creadas para el trabajo diario de salón.",
    image_url: VESUVIANA_MEDIA.lifestyle.defile_pink,
    instagram_url: "https://instagram.com/defile.ve",
    tiktok_url: "https://tiktok.com/@defile.ve",
    facebook_url: "https://facebook.com/defile.ve",
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    brand_id: "brand_oleos",
    brand_slug: "oleos",
    brand_name: "Oleos",
    brand_description:
      "Nutrición capilar de origen botánico. Shampoos y tratamientos que devuelven brillo, movimiento y suavidad al cabello.",
    image_url: VESUVIANA_MEDIA.lifestyle.oleos_campaign,
    instagram_url: "https://instagram.com/oleos.ve",
    tiktok_url: "https://tiktok.com/@oleos.ve",
    facebook_url: "https://facebook.com/oleos.ve",
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    brand_id: "brand_tricomplex",
    brand_slug: "tricomplex",
    brand_name: "Tricomplex",
    brand_description:
      "Ciencia capilar para la fibra y el cuero cabelludo. Líneas de tratamiento, higiene y peinado con ácido hialurónico y activos de alta performance.",
    image_url: VESUVIANA_MEDIA.lifestyle.tricomplex_woman,
    instagram_url: "https://instagram.com/tricomplex.ve",
    tiktok_url: "https://tiktok.com/@tricomplex.ve",
    facebook_url: "https://facebook.com/tricomplex.ve",
    sort_order: 3,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

export const VESUVIANA_INITIAL_CATEGORIES: VesuvianaCategory[] = [
  {
    category_id: "cat_defile_ampollas",
    brand_id: "brand_defile",
    category_name: "Ampollas de Tratamiento",
    category_slug: "defile-ampollas-de-tratamiento",
    category_description: "Concentrados de uso profesional para nutrir, reparar y sellar la fibra.",
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_defile_acabado",
    brand_id: "brand_defile",
    category_name: "Mascarillas y Acabado",
    category_slug: "defile-mascarillas-y-acabado",
    category_description: "Texturas de tratamiento y acabado para el cabello.",
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_oleos_shampoo",
    brand_id: "brand_oleos",
    category_name: "Shampoo y Tratamiento",
    category_slug: "oleos-shampoo-y-tratamiento",
    category_description: "Dúos de higiene y nutrición para cada necesidad capilar.",
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_tricomplex_lineas",
    brand_id: "brand_tricomplex",
    category_name: "Líneas de Tratamiento",
    category_slug: "tricomplex-lineas-de-tratamiento",
    category_description: "Sets de pre-tratamiento y tratamiento intensivo para el cabello.",
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_tricomplex_higiene",
    brand_id: "brand_tricomplex",
    category_name: "Higiene Capilar",
    category_slug: "tricomplex-higiene-capilar",
    category_description: "Shampoos profesionales para todo tipo de cabello.",
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_tricomplex_peinado",
    brand_id: "brand_tricomplex",
    category_name: "Crema de Peinar",
    category_slug: "tricomplex-crema-de-peinar",
    category_description: "Definición, desenredado y protección térmica.",
    sort_order: 3,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

export const VESUVIANA_INITIAL_PRODUCTS: VesuvianaProduct[] = [
  create_product(
    "product_defile_ampolla_k_botrox",
    "brand_defile",
    "cat_defile_ampollas",
    "Ampolla K-Botrox",
    "Ampolla profesional con keratina y ácido hialurónico para hidratar, nutrir y devolver cuerpo al cabello.",
    ["Hidrata y nutre la fibra", "Aporta brillo y suavidad", "Uso profesional en salón"],
    [VESUVIANA_MEDIA.products.defile_ampolla_azul],
    true
  ),
  create_product(
    "product_defile_ampolla_argan",
    "brand_defile",
    "cat_defile_ampollas",
    "Ampolla Aceite de Argán",
    "Concentrado de argán y vitamina E que nutre las zonas secas y sella las puntas abiertas.",
    ["Nutrición intensa", "Brillo inmediato", "Sella puntas abiertas"],
    [VESUVIANA_MEDIA.products.defile_ampolla_dorada],
    true
  ),
  create_product(
    "product_defile_ampolla_anticaida",
    "brand_defile",
    "cat_defile_ampollas",
    "Ampolla Anticaída",
    "Ampolla con extractos de romero, jengibre y biotina para fortalecer el cabello desde la raíz.",
    ["Fortalece desde la raíz", "Reduce la caída por ruptura", "Estimula la sensación de frescura"],
    [VESUVIANA_MEDIA.products.defile_ampolla_roja],
    true
  ),
  create_product(
    "product_defile_ampolla_seda",
    "brand_defile",
    "cat_defile_ampollas",
    "Ampolla Gotas de Seda",
    "Tratamiento sedoso con proteínas y aceites vegetales que repara y desenreda sin peso.",
    ["Repara la fibra", "Desenreda al instante", "Acabado sedoso"],
    [VESUVIANA_MEDIA.products.defile_ampolla_beige],
    false
  ),
  create_product(
    "product_defile_ampolla_biotina",
    "brand_defile",
    "cat_defile_ampollas",
    "Ampolla Biotina",
    "Concentrado de biotina y vitaminas del grupo B para cabellos débiles y sin movimiento.",
    ["Fortalece el cabello", "Mejora la elasticidad", "Aporta cuerpo"],
    [VESUVIANA_MEDIA.products.defile_ampolla_violeta],
    false
  ),
  create_product(
    "product_defile_mascarilla_reparadora",
    "brand_defile",
    "cat_defile_acabado",
    "Mascarilla Reparadora",
    "Mascarilla cremosa de nutrición profunda para cabellos secos, procesados o castigados por el calor.",
    ["Nutrición profunda", "Suaviza y desenreda", "Facilita el peinado"],
    [VESUVIANA_MEDIA.products.defile_mascarilla],
    false
  ),
  create_product(
    "product_defile_crema_tratamiento",
    "brand_defile",
    "cat_defile_acabado",
    "Crema de Tratamiento",
    "Crema de acabado que controla el frizz, define el movimiento y deja un brillo natural.",
    ["Controla el frizz", "Define el movimiento", "Brillo natural"],
    [VESUVIANA_MEDIA.products.defile_crema],
    false
  ),
  create_product(
    "product_defile_tratamiento_intensivo",
    "brand_defile",
    "cat_defile_acabado",
    "Tratamiento Capilar Intensivo",
    "Tratamiento de salón para restaurar la suavidad y la resistencia de la fibra capilar.",
    ["Restaura la fibra", "Mejora la textura", "Resultado de salón"],
    [VESUVIANA_MEDIA.products.defile_tratamiento],
    false
  ),
  create_product(
    "product_oleos_control_caida",
    "brand_oleos",
    "cat_oleos_shampoo",
    "Oleos Control Caída · Shampoo + Bálsamo",
    "Dúo capilar con extractos botánicos para limpiar suavemente y fortalecer el cabello debilitado.",
    ["Fortalece la fibra", "Limpieza suave", "Aporta cuerpo y brillo"],
    [VESUVIANA_MEDIA.products.oleos_control_caida],
    true
  ),
  create_product(
    "product_oleos_control_frizz",
    "brand_oleos",
    "cat_oleos_shampoo",
    "Oleos Control Frizz · Shampoo + Bálsamo",
    "Dúo de higiene y nutrición que ayuda a controlar el frizz y mantener el cabello manejable.",
    ["Controla el frizz", "Nutre sin peso", "Suavidad duradera"],
    [VESUVIANA_MEDIA.products.oleos_control_frizz],
    true
  ),
  create_product(
    "product_oleos_restaurador",
    "brand_oleos",
    "cat_oleos_shampoo",
    "Oleos Restaurador · Shampoo + Bálsamo",
    "Dúo restaurador con aceites vegetales para cabellos secos y puntas abiertas.",
    ["Repara puntas secas", "Hidratación profunda", "Brillo saludable"],
    [VESUVIANA_MEDIA.products.oleos_restaurador],
    true
  ),
  create_product(
    "product_oleos_cuidado_diario",
    "brand_oleos",
    "cat_oleos_shampoo",
    "Oleos Cuidado Diario · Shampoo + Bálsamo",
    "Limpieza de uso diario que acondiciona sin resecar la fibra.",
    ["Uso diario", "Limpieza equilibrada", "Cabello suave y ligero"],
    [VESUVIANA_MEDIA.products.oleos_cuidado_diario],
    false
  ),
  create_product(
    "product_oleos_control_caspa",
    "brand_oleos",
    "cat_oleos_shampoo",
    "Oleos Control Caspa · Shampoo + Bálsamo",
    "Dúo con activos purificantes que ayuda a equilibrar el cuero cabelludo y reducir la descamación.",
    ["Equilibra el cuero cabelludo", "Limpieza profunda", "Sensación fresca"],
    [VESUVIANA_MEDIA.products.oleos_control_caspa],
    false
  ),
  create_product(
    "product_oleos_rizos_definidos",
    "brand_oleos",
    "cat_oleos_shampoo",
    "Oleos Rizos Definidos · Shampoo + Bálsamo",
    "Dúo para ondas y rizos que hidrata, define y controla el frizz sin endurecer.",
    ["Define ondas y rizos", "Hidrata la fibra", "Controla el frizz"],
    [VESUVIANA_MEDIA.products.oleos_rizos_definidos],
    false
  ),
  create_product(
    "product_tricomplex_matizador",
    "brand_tricomplex",
    "cat_tricomplex_lineas",
    "Tricomplex Matizador",
    "Pre-tratamiento y tratamiento intensivo para neutralizar tonos amarillos y devolver luminosidad.",
    ["Neutraliza tonos amarillos", "Aporta suavidad", "Realza el brillo"],
    [VESUVIANA_MEDIA.products.tricomplex_matizador],
    true
  ),
  create_product(
    "product_tricomplex_vit_e",
    "brand_tricomplex",
    "cat_tricomplex_lineas",
    "Tricomplex Vitamina E",
    "Línea de tratamiento con vitamina E que nutre y protege la fibra capilar.",
    ["Nutrición antioxidante", "Protege la fibra", "Suavidad y brillo"],
    [VESUVIANA_MEDIA.products.tricomplex_vit_e],
    true
  ),
  create_product(
    "product_tricomplex_hialuronico",
    "brand_tricomplex",
    "cat_tricomplex_lineas",
    "Tricomplex Ácido Hialurónico",
    "Pre-tratamiento y tratamiento intensivo con ácido hialurónico para hidratar desde la raíz.",
    ["Hidratación intensa", "Fortalece el cabello", "Mejora la textura"],
    [VESUVIANA_MEDIA.products.tricomplex_hialuronico],
    true
  ),
  create_product(
    "product_tricomplex_linea_blanca",
    "brand_tricomplex",
    "cat_tricomplex_lineas",
    "Tricomplex Línea Blanca",
    "Shampoo y baño de crema con ácido hialurónico para una rutina de hidratación completa.",
    ["Hidrata y suaviza", "Limpieza delicada", "Brillo natural"],
    [VESUVIANA_MEDIA.products.tricomplex_linea_blanca],
    true
  ),
  create_product(
    "product_tricomplex_ph_shampoo",
    "brand_tricomplex",
    "cat_tricomplex_higiene",
    "Shampoo PH Neutro 2 L",
    "Shampoo profesional de pH neutro para todo tipo de cabello. Formato de 2 litros para uso frecuente.",
    ["Limpieza diaria", "pH equilibrado", "Apto para todo tipo de cabello"],
    [VESUVIANA_MEDIA.products.tricomplex_ph_shampoo],
    false
  ),
  create_product(
    "product_tricomplex_ph_galon",
    "brand_tricomplex",
    "cat_tricomplex_higiene",
    "Shampoo PH Neutro Galón",
    "Formato profesional de 1 galón para salones y alto volumen de uso.",
    ["Formato profesional", "Rendimiento prolongado", "Limpieza suave"],
    [VESUVIANA_MEDIA.products.tricomplex_ph_galon],
    false
  ),
  create_product(
    "product_tricomplex_activador_rizos",
    "brand_tricomplex",
    "cat_tricomplex_peinado",
    "Activador de Rizos",
    "Crema de peinar con ácido hialurónico y D-pantenol que activa la forma del rizo con hidratación y brillo.",
    ["Activa y define el rizo", "Hidrata y aporta brillo", "Protege del calor"],
    [VESUVIANA_MEDIA.products.tricomplex_activador],
    false
  ),
  create_product(
    "product_tricomplex_desenredante",
    "brand_tricomplex",
    "cat_tricomplex_peinado",
    "Crema de Peinar Desenredante",
    "Crema ligera que desenreda, protege del calor y facilita el cepillado sin dejar residuo.",
    ["Desenreda al instante", "Protección térmica", "Acabado ligero"],
    [VESUVIANA_MEDIA.products.tricomplex_desenredante],
    false
  ),
  create_product(
    "product_tricomplex_crespos_definidos",
    "brand_tricomplex",
    "cat_tricomplex_peinado",
    "Crema para Peinar Crespos Definidos",
    "Crema de definición para rizos y crespos que hidrata, controla el volumen y mantiene la forma.",
    ["Define crespos y rizos", "Controla el volumen", "Hidratación duradera"],
    [VESUVIANA_MEDIA.products.tricomplex_crespos],
    false
  )
];

export const VESUVIANA_INITIAL_SLIDES: VesuvianaCarouselSlide[] = [
  {
    slide_id: "slide_lujo_capilar",
    slide_subtitle: "Vesuviana Cosmetics",
    slide_title: "El lujo de cuidar tu cabello",
    slide_description:
      "Tratamientos profesionales para devolverle fuerza, movimiento y brillo a cada tipo de cabello.",
    cta_label: "Explorar catálogo",
    cta_href: "/catalogo",
    image_url: VESUVIANA_MEDIA.hero.campaign,
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    slide_id: "slide_brillo_real",
    slide_subtitle: "Oleos · Nutrición capilar",
    slide_title: "Brillo que se siente, no se fuerza",
    slide_description:
      "Shampoos y bálsamos con activos botánicos que hidratan, suavizan y acompañan la rutina de tu cabello.",
    cta_label: "Explorar catálogo",
    cta_href: "/catalogo",
    image_url: VESUVIANA_MEDIA.lifestyle.oleos_spa,
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    slide_id: "slide_fuerza_raiz",
    slide_subtitle: "Tricomplex · Ciencia capilar",
    slide_title: "Fuerza y suavidad desde la raíz",
    slide_description:
      "Líneas de tratamiento, higiene y peinado con ácido hialurónico para el cabello que pide más.",
    cta_label: "Explorar catálogo",
    cta_href: "/catalogo",
    image_url: VESUVIANA_MEDIA.lifestyle.tricomplex_woman,
    sort_order: 3,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

const advisor_seed = [
  { advisor_id: "advisor_carabobo_andreina", advisor_name: "Andreína Salcedo", state_name: "Carabobo", zone_name: "Valencia y área metropolitana", whatsapp_number: "+58 412 556 7301" },
  { advisor_id: "advisor_caracas_carlos", advisor_name: "Carlos Eduardo Mendoza", state_name: "Caracas", zone_name: "Distrito Capital y Gran Caracas", whatsapp_number: "+58 416 734 2890" },
  { advisor_id: "advisor_lara_gabriela", advisor_name: "Gabriela Pérez", state_name: "Lara", zone_name: "Barquisimeto y Cabudare", whatsapp_number: "+58 424 618 5527" },
  { advisor_id: "advisor_zulia_luisana", advisor_name: "Luisana Rojas", state_name: "Zulia", zone_name: "Maracaibo, San Francisco y Costa Oriental", whatsapp_number: "+58 412 903 4456" },
  { advisor_id: "advisor_miranda_miguel", advisor_name: "Miguel Ángel Ruiz", state_name: "Miranda", zone_name: "Los Teques, Guarenas y Guatire", whatsapp_number: "+58 416 557 2190" },
  { advisor_id: "advisor_anzoategui_daniela", advisor_name: "Daniela Contreras", state_name: "Anzoátegui", zone_name: "Barcelona, Puerto La Cruz y Lechería", whatsapp_number: "+58 414 812 0973" },
  { advisor_id: "advisor_bolivar_yelitza", advisor_name: "Yelitza Farías", state_name: "Bolívar", zone_name: "Ciudad Guayana y Ciudad Bolívar", whatsapp_number: "+58 424 771 3028" },
  { advisor_id: "advisor_tachira_jose", advisor_name: "José Manuel Herrera", state_name: "Táchira", zone_name: "San Cristóbal y zona andina", whatsapp_number: "+58 417 245 6678" },
  { advisor_id: "advisor_aragua_sofia", advisor_name: "Sofía Alvarado", state_name: "Aragua", zone_name: "Maracay, Turmero y La Victoria", whatsapp_number: "+58 412 330 8845" },
  { advisor_id: "advisor_nueva_esparta_alejandro", advisor_name: "Alejandro Marcano", state_name: "Nueva Esparta", zone_name: "Isla de Margarita", whatsapp_number: "+58 412 664 1190" }
];

export const VESUVIANA_INITIAL_ADVISORS: WholesaleAdvisor[] = advisor_seed.map((advisor_item) => ({
  ...advisor_item,
  is_active: true,
  created_at: seeded_at,
  updated_at: seeded_at
}));

const distributor_seed = [
  { distributor_id: "distributor_carabobo_centro", store_name: "Casa Defile Valencia Centro", state_name: "Carabobo", zone_name: "Valencia Centro", address_line: "Av. Bolívar, entre calle Sucre y calle Comercio, Centro Comercial Bolívar, Nivel PB, Local 12", whatsapp_number: "+58 424 401 7788", instagram_handle_or_url: "@casadefile.valencia" },
  { distributor_id: "distributor_carabobo_bolivar_norte", store_name: "Bella Época Beauty Store", state_name: "Carabobo", zone_name: "Av. Bolívar Norte", address_line: "Av. Bolívar Norte, Torre Marbella, Nivel PB, Local 3, frente a Plaza Sucre", whatsapp_number: "+58 412 318 4409", instagram_handle_or_url: "https://instagram.com/bellaepoca.beauty" },
  { distributor_id: "distributor_carabobo_san_diego", store_name: "Óleos Studio San Diego", state_name: "Carabobo", zone_name: "San Diego", address_line: "Av. Diego Ibarra, Centro Comercial San Diego, Nivel 1, Local 18", whatsapp_number: "+58 416 622 1150", instagram_handle_or_url: "@oleos.studio" },
  { distributor_id: "distributor_caracas_mercedes", store_name: "Vesuviana Atelier Las Mercedes", state_name: "Caracas", zone_name: "Las Mercedes", address_line: "Av. Principal Las Mercedes, Centro Comercial Paseo Las Mercedes, Nivel 1, Local 15", whatsapp_number: "+58 416 201 7734", instagram_handle_or_url: "@vesuviana.atelier" },
  { distributor_id: "distributor_aragua_maracay", store_name: "Belleza Botánica Maracay", state_name: "Aragua", zone_name: "Maracay Centro", address_line: "Av. Bolívar Este, Centro Comercial Parque Aragua, Nivel 1, Local 8", whatsapp_number: "+58 412 447 6620", instagram_handle_or_url: "@bellezabotanica.mcy" },
  { distributor_id: "distributor_lara_barquisimeto", store_name: "Defile Barquisimeto", state_name: "Lara", zone_name: "Barquisimeto Centro", address_line: "Av. Venezuela, Centro Comercial Barquisimeto, Nivel PB, Local 10", whatsapp_number: "+58 424 318 5507", instagram_handle_or_url: "@defile.bqto" },
  { distributor_id: "distributor_zulia_maracaibo", store_name: "Defile Maracaibo", state_name: "Zulia", zone_name: "Maracaibo Norte", address_line: "Av. 5 de Julio, Centro Comercial Lago Mall, Nivel 1, Local 22", whatsapp_number: "+58 424 762 8810", instagram_handle_or_url: "@defile.maracaibo" },
  { distributor_id: "distributor_miranda_los_teques", store_name: "Óleos Studio Los Teques", state_name: "Miranda", zone_name: "Los Teques Centro", address_line: "Av. Francisco de Miranda, Centro Comercial La Cascada, Nivel PB, Local 6", whatsapp_number: "+58 412 903 1176", instagram_handle_or_url: "@oleos.losteques" },
  { distributor_id: "distributor_anzoategui_puerto_la_cruz", store_name: "Vesuviana Atelier Puerto La Cruz", state_name: "Anzoátegui", zone_name: "Puerto La Cruz", address_line: "Av. Municipal, Centro Comercial Regina, Nivel 1, Local 14", whatsapp_number: "+58 414 338 9021", instagram_handle_or_url: "@vesuviana.puertolacruz" },
  { distributor_id: "distributor_bolivar_ciudad_guayana", store_name: "Belleza Botánica Guayana", state_name: "Bolívar", zone_name: "Ciudad Guayana", address_line: "Av. Las Américas, Centro Comercial Orinokia, Nivel 1, Local 9", whatsapp_number: "+58 424 612 4478", instagram_handle_or_url: "@bellezabotanica.guayana" },
  { distributor_id: "distributor_tachira_san_cristobal", store_name: "Bella Época San Cristóbal", state_name: "Táchira", zone_name: "San Cristóbal Centro", address_line: "Av. 5 de Julio con calle 10, Centro Comercial Barquicenter, Nivel PB, Local 4", whatsapp_number: "+58 417 584 2203", instagram_handle_or_url: "@bellaepoca.tachira" },
  { distributor_id: "distributor_nueva_esparta_porlamar", store_name: "Óleos Studio Margarita", state_name: "Nueva Esparta", zone_name: "Porlamar", address_line: "Av. Santiago Mariño, Centro Comercial Sambil Margarita, Nivel PB, Local 31", whatsapp_number: "+58 412 774 6608", instagram_handle_or_url: "@oleos.margarita" }
];

export const VESUVIANA_INITIAL_DISTRIBUTORS: AuthorizedDistributor[] = distributor_seed.map((distributor_item) => ({
  ...distributor_item,
  is_active: true,
  created_at: seeded_at,
  updated_at: seeded_at
}));

export const VESUVIANA_INITIAL_USERS: AdminUser[] = [
  {
    user_id: "user_super_eduardo",
    full_name: "Eduardo",
    email: "eduardo@vesuvianacosmetics.com",
    role: "SUPER_ADMIN",
    is_banned: false,
    password_salt: "vesuviana-eduardo-2026",
    password_hash: "0df7a9db4bc984c5f464d044a0023501d065d22a7cdf3724a123592f5ef29e19",
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-01-15T09:00:00.000Z"
  },
  {
    user_id: "user_moderator_sandra",
    full_name: "Sandra Nino",
    email: "sandra.nino@vesuvianacosmetics.com",
    role: "MODERATOR",
    is_banned: false,
    password_salt: "vesuviana-sandra-2026",
    password_hash: "ba06bfa097c146d67dd11e0f805da69db09d7448723b3dbe7897184f6f5d2ac3",
    created_at: "2026-03-02T10:30:00.000Z",
    updated_at: "2026-03-02T10:30:00.000Z"
  }
];

export const VESUVIANA_INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    log_id: "audit_seed_01",
    occurred_at: "2026-10-18T14:32:00.000Z",
    actor_user_id: "user_super_eduardo",
    actor_name: "Eduardo",
    actor_role: "SUPER_ADMIN",
    action_type: "UPDATE",
    module_name: "PRODUCTOS",
    change_summary: "Actualizó las imágenes del catálogo capilar."
  },
  {
    log_id: "audit_seed_02",
    occurred_at: "2026-10-19T09:15:00.000Z",
    actor_user_id: "user_moderator_sandra",
    actor_name: "Sandra Nino",
    actor_role: "MODERATOR",
    action_type: "CREATE",
    module_name: "DISTRIBUIDORES",
    change_summary: "Registró la tienda Bella Época Beauty Store en Carabobo."
  },
  {
    log_id: "audit_seed_03",
    occurred_at: "2026-10-19T16:40:00.000Z",
    actor_user_id: "user_moderator_sandra",
    actor_name: "Sandra Nino",
    actor_role: "MODERATOR",
    action_type: "UPDATE",
    module_name: "CARRUSEL",
    change_summary: "Reordenó las diapositivas de la portada principal."
  }
];

export const VESUVIANA_INITIAL_STATE: VesuvianaSiteState = {
  schema_version: CURRENT_SCHEMA_VERSION,
  seed_version: CURRENT_SEED_VERSION,
  brands: VESUVIANA_INITIAL_BRANDS,
  categories: VESUVIANA_INITIAL_CATEGORIES,
  products: VESUVIANA_INITIAL_PRODUCTS,
  carousel_slides: VESUVIANA_INITIAL_SLIDES,
  wholesale_advisors: VESUVIANA_INITIAL_ADVISORS,
  distributors: VESUVIANA_INITIAL_DISTRIBUTORS,
  users: VESUVIANA_INITIAL_USERS,
  audit_logs: VESUVIANA_INITIAL_AUDIT_LOGS,
  last_updated_at: "2026-10-21T10:15:00.000Z"
};

export const create_factory_state = (): VesuvianaSiteState =>
  JSON.parse(JSON.stringify(VESUVIANA_INITIAL_STATE)) as VesuvianaSiteState;
