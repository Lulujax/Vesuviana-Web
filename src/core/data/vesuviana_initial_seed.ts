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
import { HERO_IMAGE_URLS } from "@/core/data/vesuviana_landing_content";

const square_image = (photo_id: string) =>
  `https://images.unsplash.com/photo-${photo_id}?auto=format&fit=crop&w=900&h=900&q=80`;

const brand_image = (photo_id: string) =>
  `https://images.unsplash.com/photo-${photo_id}?auto=format&fit=crop&w=900&h=900&q=80`;

const seeded_at = "2026-09-15T12:00:00.000Z";

export const VESUVIANA_INITIAL_BRANDS: VesuvianaBrand[] = [
  {
    brand_id: "brand_defile",
    brand_slug: "defile",
    brand_name: "Defile",
    brand_description:
      "Línea profesional de salón. Alisadores, decolorantes, shampoos y tratamientos de alta performance para estilistas que buscan precisión y resultados duraderos.",
    image_url: brand_image("1492106087820-71f1a00d2b11"),
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
      "Elixires y nutrición botánica. Óleos capilares, mascarillas y bálsamos con extractos naturales que devuelven brillo, suavidad y elasticidad.",
    image_url: brand_image("1608571423902-eed4a5ad8108"),
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
      "Cuidado facial y dermocosmética. Serums bio-activos, limpiadores y tónicos formulados con biotecnología cosmética para el equilibrio de la piel.",
    image_url: brand_image("1620916566398-39f1143ab7be"),
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
    category_id: "cat_defile_alisadores",
    brand_id: "brand_defile",
    category_name: "Alisadores",
    category_slug: "defile-alisadores",
    category_description: "Tratamientos térmicos y alisados de salón con acabado natural.",
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_defile_shampoos",
    brand_id: "brand_defile",
    category_name: "Shampoos Profesionales",
    category_slug: "defile-shampoos-profesionales",
    category_description: "Limpieza de salón, detox y mantenimiento del color.",
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_defile_decolorantes",
    brand_id: "brand_defile",
    category_name: "Decolorantes",
    category_slug: "defile-decolorantes",
    category_description: "Aclarado controlado con protección de la fibra capilar.",
    sort_order: 3,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_defile_tratamientos",
    brand_id: "brand_defile",
    category_name: "Tratamientos Capilares",
    category_slug: "defile-tratamientos-capilares",
    category_description: "Reconstrucción, nutrición y sellado profesional.",
    sort_order: 4,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_oleos_oleos_capilares",
    brand_id: "brand_oleos",
    category_name: "Óleos Capilares",
    category_slug: "oleos-oleos-capilares",
    category_description: "Elixires ligeros para brillo, nutrición y protección.",
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_oleos_mascarillas",
    brand_id: "brand_oleos",
    category_name: "Mascarillas Nutritivas",
    category_slug: "oleos-mascarillas-nutritivas",
    category_description: "Nutrición intensiva para cabellos secos, gruesos o rizados.",
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_oleos_reparacion",
    brand_id: "brand_oleos",
    category_name: "Reparación e Hidratación",
    category_slug: "oleos-reparacion-e-hidratacion",
    category_description: "Bálsamos y tratamientos para puntas y fibras sensibilizadas.",
    sort_order: 3,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_tricomplex_tratamientos_faciales",
    brand_id: "brand_tricomplex",
    category_name: "Tratamientos Faciales",
    category_slug: "tricomplex-tratamientos-faciales",
    category_description: "Emulsiones y tratamientos para equilibrar la piel.",
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_tricomplex_serums",
    brand_id: "brand_tricomplex",
    category_name: "Serums Bio-Activos",
    category_slug: "tricomplex-serums-bio-activos",
    category_description: "Concentrados de activos para luminosidad y firmeza.",
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_tricomplex_limpiadores",
    brand_id: "brand_tricomplex",
    category_name: "Limpiadores Dermocosméticos",
    category_slug: "tricomplex-limpiadores-dermocosmeticos",
    category_description: "Limpieza suave que respeta la barrera cutánea.",
    sort_order: 3,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    category_id: "cat_tricomplex_tonicos",
    brand_id: "brand_tricomplex",
    category_name: "Tónicos Hidratantes",
    category_slug: "tricomplex-tonicos-hidratantes",
    category_description: "Frescura, hidratación y preparación para el sérum.",
    sort_order: 4,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

export const VESUVIANA_INITIAL_PRODUCTS: VesuvianaProduct[] = [
  {
    product_id: "product_defile_alisador_seda",
    product_slug: "alisador-ionico-seda-de-bruma",
    brand_id: "brand_defile",
    category_id: "cat_defile_alisadores",
    product_name: "Alisador Iónico Seda de Bruma",
    product_description:
      "Tratamiento alisador de salón con keratina hidrolizada y aceite de nuez de macadamia. Sella la cutícula, reduce el frizz y deja un acabado espejo sin rigidez.",
    product_benefits: [
      "Alisado profesional por hasta 12 semanas",
      "Control de frizz con acabado natural",
      "Protección térmica hasta 230 °C"
    ],
    image_urls: [square_image("1492106087820-71f1a00d2b11"), square_image("1560066984-138dadb4c035")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_defile_shampoo_detox",
    product_slug: "shampoo-profesional-detox-botanico",
    brand_id: "brand_defile",
    category_id: "cat_defile_shampoos",
    product_name: "Shampoo Profesional Detox Botánico",
    product_description:
      "Limpieza profunda con arcilla verde, romero y biotina. Retira residuos de producto y sebo sin resecar el cuero cabelludo.",
    product_benefits: [
      "Detox suave del cuero cabelludo",
      "Fortalece la fibra desde la raíz",
      "Apto para uso diario en salón"
    ],
    image_urls: [square_image("1631729371254-42c2892f0e6e"), square_image("1595476108010-b4d1f102b1b1")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_defile_decolorante_platinum",
    product_slug: "decolorante-platinum-bloom",
    brand_id: "brand_defile",
    category_id: "cat_defile_decolorantes",
    product_name: "Decolorante Platinum Bloom",
    product_description:
      "Polvo decolorante de textura cremosa con agentes protectores de la fibra y pigmentos neutralizantes. Aclara hasta 9 tonos con control de rubio.",
    product_benefits: [
      "Aclarado uniforme y predecible",
      "Menos daño y mejor elasticidad",
      "Resultado rubio frío y luminoso"
    ],
    image_urls: [square_image("1524504388940-b1c1722653e1"), square_image("1519699047748-de8e457a634e")],
    is_featured: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_defile_mascara_querativa",
    product_slug: "mascara-de-reconstruccion-querativa",
    brand_id: "brand_defile",
    category_id: "cat_defile_tratamientos",
    product_name: "Máscara de Reconstrucción Querativa",
    product_description:
      "Mascarilla intensiva con queratina vegetal, aminoácidos y manteca de karité. Reconstruye la fibra dañada por coloración o calor.",
    product_benefits: [
      "Repara la fibra en 10 minutos",
      "Nutrición profunda sin peso",
      "Suavidad y brillo inmediatos"
    ],
    image_urls: [square_image("1608248543803-ba4f8c70ae0b"), square_image("1631729371254-42c2892f0e6e")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_defile_shampoo_matizador",
    product_slug: "shampoo-matizador-rubio-perla",
    brand_id: "brand_defile",
    category_id: "cat_defile_shampoos",
    product_name: "Shampoo Matizador Rubio Perla",
    product_description:
      "Fórmula con pigmento violeta y extracto de arándano que neutraliza tonos amarillos en rubios, decolorados y canas.",
    product_benefits: [
      "Neutraliza reflejos amarillos",
      "Hidrata y aporta brillo",
      "Uso semanal en salón y casa"
    ],
    image_urls: [square_image("1524504388940-b1c1722653e1"), square_image("1595476108010-b4d1f102b1b1")],
    is_featured: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_oleos_argan_amla",
    product_slug: "oleo-capilar-argan-y-amla",
    brand_id: "brand_oleos",
    category_id: "cat_oleos_oleos_capilares",
    product_name: "Óleo Capilar Argán & Amla",
    product_description:
      "Elixir ligero de argán, amla y vitamina E que nutre medios y puntas. Aporta brillo inmediato y protege del calor sin sensación grasa.",
    product_benefits: [
      "Nutrición y brillo sin peso",
      "Protección contra el calor",
      "Sella puntas abiertas"
    ],
    image_urls: [square_image("1608571423902-eed4a5ad8108"), square_image("1620916297397-a4a5402a3c6c")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_oleos_rosa_mosqueta",
    product_slug: "elixir-de-rosa-mosqueta",
    brand_id: "brand_oleos",
    category_id: "cat_oleos_oleos_capilares",
    product_name: "Elixir de Rosa Mosqueta",
    product_description:
      "Aceite de rosa mosqueta prensado en frío con escualano vegetal. Devuelve elasticidad y suavidad a cabellos secos y opacos.",
    product_benefits: [
      "Hidratación profunda y elástica",
      "Mejora la textura del cabello",
      "Fórmula de rápida absorción"
    ],
    image_urls: [square_image("1617897903246-719242758050"), square_image("1608571423902-eed4a5ad8108")],
    is_featured: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_oleos_mascarilla_cacao",
    product_slug: "mascarilla-nutritiva-cacao-y-karite",
    brand_id: "brand_oleos",
    category_id: "cat_oleos_mascarillas",
    product_name: "Mascarilla Nutritiva Cacao & Karité",
    product_description:
      "Mascarilla cremosa con cacao, karité y proteína de trigo. Nutre intensamente y facilita el desenredado en cabellos gruesos o rizados.",
    product_benefits: [
      "Nutrición intensiva para cabellos secos",
      "Desenreda y define la onda",
      "Aroma cálido y envolvente"
    ],
    image_urls: [square_image("1601612628452-9e99ced43524"), square_image("1620916297397-a4a5402a3c6c")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_oleos_balsamo_puntas",
    product_slug: "balsamo-reparador-de-puntas",
    brand_id: "brand_oleos",
    category_id: "cat_oleos_reparacion",
    product_name: "Bálsamo Reparador de Puntas",
    product_description:
      "Bálsamo sin enjuague con ceramidas vegetales y aceite de jojoba que repara puntas abiertas y protege contra la fricción diaria.",
    product_benefits: [
      "Repara y sella puntas abiertas",
      "Protección térmica y anticontaminación",
      "Acabado sedoso sin residuo"
    ],
    image_urls: [square_image("1620916297397-a4a5402a3c6c"), square_image("1617897903246-719242758050")],
    is_featured: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_tricomplex_serum_vitamina_c",
    product_slug: "serum-vitamina-c-15-ferulico",
    brand_id: "brand_tricomplex",
    category_id: "cat_tricomplex_serums",
    product_name: "Sérum Vitamina C 15% + Ferúlico",
    product_description:
      "Sérum antioxidante con vitamina C estabilizada, ácido ferúlico y vitamina E. Ilumina, unifica el tono y protege del estrés oxidativo.",
    product_benefits: [
      "Luminosidad y tono uniforme",
      "Protección antioxidante diaria",
      "Textura ligera de rápida absorción"
    ],
    image_urls: [square_image("1615397349754-cfa2066a298e"), square_image("1611930022073-b7a4ba5fcccd")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_tricomplex_niacinamida",
    product_slug: "tratamiento-facial-niacinamida-10",
    brand_id: "brand_tricomplex",
    category_id: "cat_tricomplex_tratamientos_faciales",
    product_name: "Tratamiento Facial Niacinamida 10%",
    product_description:
      "Emulsión equilibradora con niacinamida, zinc PCA y extracto de té verde. Reduce poros visibles, controla el brillo y calma rojeces.",
    product_benefits: [
      "Equilibra la piel mixta a grasa",
      "Minimiza poros y marcas",
      "Calma y fortalece la barrera"
    ],
    image_urls: [square_image("1620916566398-39f1143ab7be"), square_image("1601612628452-9e99ced43524")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_tricomplex_limpiador_hyaluronic",
    product_slug: "limpiador-dermocosmetico-acido-hialuronico",
    brand_id: "brand_tricomplex",
    category_id: "cat_tricomplex_limpiadores",
    product_name: "Limpiador Dermocosmético Ácido Hialurónico",
    product_description:
      "Gel de limpieza suave con ácido hialurónico, glicerina y avena coloidal. Limpia sin arrastrar la hidratación natural de la piel.",
    product_benefits: [
      "Limpieza suave y respetuosa",
      "Hidrata mientras limpia",
      "Apto para piel sensible"
    ],
    image_urls: [square_image("1598440947619-2c35fc9aa908"), square_image("1556228720-195a672e8a03")],
    is_featured: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    product_id: "product_tricomplex_tonico_pha",
    product_slug: "tonico-hidratante-pha-agua-de-rosas",
    brand_id: "brand_tricomplex",
    category_id: "cat_tricomplex_tonicos",
    product_name: "Tónico Hidratante PHA + Agua de Rosas",
    product_description:
      "Tónico con gluconolactona y agua de rosas que afina la textura, refresca y prepara la piel para el sérum.",
    product_benefits: [
      "Hidratación y frescura inmediata",
      "Exfoliación suave con PHA",
      "Calma y prepara la piel"
    ],
    image_urls: [square_image("1601612628452-9e99ced43524"), square_image("1598440947619-2c35fc9aa908")],
    is_featured: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

export const VESUVIANA_INITIAL_SLIDES: VesuvianaCarouselSlide[] = [
  {
    slide_id: "slide_ritual",
    slide_subtitle: "Vesuviana Cosmetics · Nueva temporada",
    slide_title: "El lujo de cuidar tu cabello",
    slide_description:
      "Fórmulas profesionales con bio-activos y extractos naturales, creadas para transformar tu ritual diario.",
    cta_label: "Explorar catálogo",
    cta_href: "/catalogo",
    image_url: HERO_IMAGE_URLS.hair_portrait,
    sort_order: 1,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    slide_id: "slide_defile",
    slide_subtitle: "Defile · Línea profesional",
    slide_title: "Precisión de salón, suavidad en casa",
    slide_description:
      "Alisadores, decolorantes y tratamientos que respetan la fibra mientras revelan su mejor textura.",
    cta_label: "Descubrir Defile",
    cta_href: "/catalogo?marca=defile",
    image_url: HERO_IMAGE_URLS.salon_space,
    sort_order: 2,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    slide_id: "slide_oleos",
    slide_subtitle: "Oleos · Nutrición botánica",
    slide_title: "El elixir que tu cabello esperaba",
    slide_description:
      "Óleos y mascarillas con argán, karité y rosa mosqueta para nutrir, sellar y devolver el brillo.",
    cta_label: "Descubrir Oleos",
    cta_href: "/catalogo?marca=oleos",
    image_url: HERO_IMAGE_URLS.amber_bottle,
    sort_order: 3,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    slide_id: "slide_tricomplex",
    slide_subtitle: "Tricomplex · Dermocosmética",
    slide_title: "Ciencia que devuelve el equilibrio",
    slide_description:
      "Serums y tratamientos faciales con activos de alto desempeño para una piel luminosa y saludable.",
    cta_label: "Descubrir Tricomplex",
    cta_href: "/catalogo?marca=tricomplex",
    image_url: HERO_IMAGE_URLS.dark_cosmetics,
    sort_order: 4,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

export const VESUVIANA_INITIAL_ADVISORS: WholesaleAdvisor[] = [
  {
    advisor_id: "advisor_national_maria",
    advisor_name: "María Victoria Quintero",
    state_name: "Nacional",
    zone_name: "Gerencia Nacional de Ventas al Mayor",
    whatsapp_number: "+58 414 238 9012",
    is_general_manager: true,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_carabobo_andreina",
    advisor_name: "Andreína Salcedo",
    state_name: "Carabobo",
    zone_name: "Valencia y área metropolitana",
    whatsapp_number: "+58 412 556 7301",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_caracas_carlos",
    advisor_name: "Carlos Eduardo Mendoza",
    state_name: "Caracas",
    zone_name: "Distrito Capital y Gran Caracas",
    whatsapp_number: "+58 416 734 2890",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_lara_gabriela",
    advisor_name: "Gabriela Pérez",
    state_name: "Lara",
    zone_name: "Barquisimeto y Cabudare",
    whatsapp_number: "+58 424 618 5527",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_zulia_luisana",
    advisor_name: "Luisana Rojas",
    state_name: "Zulia",
    zone_name: "Maracaibo, San Francisco y Costa Oriental",
    whatsapp_number: "+58 412 903 4456",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_miranda_miguel",
    advisor_name: "Miguel Ángel Ruiz",
    state_name: "Miranda",
    zone_name: "Los Teques, Guarenas y Guatire",
    whatsapp_number: "+58 416 557 2190",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_anzoategui_daniela",
    advisor_name: "Daniela Contreras",
    state_name: "Anzoátegui",
    zone_name: "Barcelona, Puerto La Cruz y Lechería",
    whatsapp_number: "+58 414 812 0973",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_bolivar_yelitza",
    advisor_name: "Yelitza Farías",
    state_name: "Bolívar",
    zone_name: "Ciudad Guayana y Ciudad Bolívar",
    whatsapp_number: "+58 424 771 3028",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_tachira_jose",
    advisor_name: "José Manuel Herrera",
    state_name: "Táchira",
    zone_name: "San Cristóbal y zona andina",
    whatsapp_number: "+58 417 245 6678",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_aragua_sofia",
    advisor_name: "Sofía Alvarado",
    state_name: "Aragua",
    zone_name: "Maracay, Turmero y La Victoria",
    whatsapp_number: "+58 412 330 8845",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    advisor_id: "advisor_nueva_esparta_alejandro",
    advisor_name: "Alejandro Marcano",
    state_name: "Nueva Esparta",
    zone_name: "Isla de Margarita",
    whatsapp_number: "+58 412 664 1190",
    is_general_manager: false,
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

export const VESUVIANA_INITIAL_DISTRIBUTORS: AuthorizedDistributor[] = [
  {
    distributor_id: "distributor_carabobo_centro",
    store_name: "Casa Defile Valencia Centro",
    state_name: "Carabobo",
    zone_name: "Valencia Centro",
    address_line: "Av. Bolívar, entre calle Sucre y calle Comercio, Centro Comercial Bolívar, Nivel PB, Local 12",
    whatsapp_number: "+58 424 401 7788",
    instagram_handle_or_url: "@casadefile.valencia",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_carabobo_bolivar_norte",
    store_name: "Bella Época Beauty Store",
    state_name: "Carabobo",
    zone_name: "Av. Bolívar Norte",
    address_line: "Av. Bolívar Norte, Torre Marbella, Nivel PB, Local 3, frente a Plaza Sucre",
    whatsapp_number: "+58 412 318 4409",
    instagram_handle_or_url: "https://instagram.com/bellaepoca.beauty",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_carabobo_san_diego",
    store_name: "Óleos Studio San Diego",
    state_name: "Carabobo",
    zone_name: "San Diego",
    address_line: "Av. Diego Ibarra, Centro Comercial San Diego, Nivel 1, Local 18",
    whatsapp_number: "+58 416 622 1150",
    instagram_handle_or_url: "@oleos.studio",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_carabobo_viniedo",
    store_name: "Tricomplex Lab El Viñedo",
    state_name: "Carabobo",
    zone_name: "El Viñedo",
    address_line: "Av. Universidad, Centro Comercial El Viñedo, Nivel 2, Local 24",
    whatsapp_number: "+58 414 733 9021",
    instagram_handle_or_url: "",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_carabobo_prebo",
    store_name: "Distribuidora Prebo Beauty",
    state_name: "Carabobo",
    zone_name: "Prebo",
    address_line: "Calle Los Laboratorios, Torre Prebo, Nivel PB, Local 7",
    whatsapp_number: "+58 412 889 6640",
    instagram_handle_or_url: "https://instagram.com/prebobeauty",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_caracas_mercedes",
    store_name: "Vesuviana Atelier Las Mercedes",
    state_name: "Caracas",
    zone_name: "Las Mercedes",
    address_line: "Av. Principal Las Mercedes, Centro Comercial Paseo Las Mercedes, Nivel 1, Local 15",
    whatsapp_number: "+58 416 201 7734",
    instagram_handle_or_url: "@vesuviana.atelier",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_caracas_sabana_grande",
    store_name: "Salón Aurora Sabana Grande",
    state_name: "Caracas",
    zone_name: "Sabana Grande",
    address_line: "Av. Casanova, Edificio Centro Comercial El Recreo, Nivel 2, Local 22",
    whatsapp_number: "+58 424 512 9083",
    instagram_handle_or_url: "",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_aragua_maracay",
    store_name: "Belleza Botánica Maracay",
    state_name: "Aragua",
    zone_name: "Maracay Centro",
    address_line: "Av. Bolívar Este, Centro Comercial Parque Aragua, Nivel 1, Local 8",
    whatsapp_number: "+58 412 447 6620",
    instagram_handle_or_url: "@bellezabotanica.mcy",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_aragua_turmero",
    store_name: "Studio Oleos Turmero",
    state_name: "Aragua",
    zone_name: "Turmero",
    address_line: "Calle Miranda, Centro Comercial Paseo Turmero, Nivel PB, Local 4",
    whatsapp_number: "+58 416 755 1198",
    instagram_handle_or_url: "",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_lara_barquisimeto",
    store_name: "Defile Barquisimeto",
    state_name: "Lara",
    zone_name: "Barquisimeto Centro",
    address_line: "Av. Venezuela, Centro Comercial Barquisimeto, Nivel PB, Local 10",
    whatsapp_number: "+58 424 318 5507",
    instagram_handle_or_url: "@defile.bqto",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  },
  {
    distributor_id: "distributor_lara_cabudare",
    store_name: "Dermo Lab Cabudare",
    state_name: "Lara",
    zone_name: "Cabudare",
    address_line: "Av. Intercomunal Cabudare, Centro Comercial La Mata, Nivel 1, Local 6",
    whatsapp_number: "+58 412 990 3384",
    instagram_handle_or_url: "https://instagram.com/dermolab.cabudare",
    is_active: true,
    created_at: seeded_at,
    updated_at: seeded_at
  }
];

export const VESUVIANA_INITIAL_USERS: AdminUser[] = [
  {
    user_id: "user_super_alessandra",
    full_name: "Alessandra Vesuviana",
    email: "alessandra@vesuvianacosmetics.com",
    role: "SUPER_ADMIN",
    is_banned: false,
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-01-15T09:00:00.000Z"
  },
  {
    user_id: "user_moderator_camila",
    full_name: "Camila Duarte",
    email: "camila.duarte@vesuvianacosmetics.com",
    role: "MODERATOR",
    is_banned: false,
    created_at: "2026-03-02T10:30:00.000Z",
    updated_at: "2026-03-02T10:30:00.000Z"
  },
  {
    user_id: "user_moderator_ricardo",
    full_name: "Ricardo Salas",
    email: "ricardo.salas@vesuvianacosmetics.com",
    role: "MODERATOR",
    is_banned: false,
    created_at: "2026-05-18T14:15:00.000Z",
    updated_at: "2026-05-18T14:15:00.000Z"
  }
];

export const VESUVIANA_INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    log_id: "audit_seed_01",
    occurred_at: "2026-10-18T14:32:00.000Z",
    actor_user_id: "user_super_alessandra",
    actor_name: "Alessandra Vesuviana",
    actor_role: "SUPER_ADMIN",
    action_type: "UPDATE",
    module_name: "PRODUCTOS",
    change_summary: "Actualizó la imagen principal del Sérum Vitamina C 15% + Ferúlico."
  },
  {
    log_id: "audit_seed_02",
    occurred_at: "2026-10-19T09:15:00.000Z",
    actor_user_id: "user_moderator_camila",
    actor_name: "Camila Duarte",
    actor_role: "MODERATOR",
    action_type: "CREATE",
    module_name: "DISTRIBUIDORES",
    change_summary: "Registró la tienda Bella Época Beauty Store en Av. Bolívar Norte, Carabobo."
  },
  {
    log_id: "audit_seed_03",
    occurred_at: "2026-10-19T16:40:00.000Z",
    actor_user_id: "user_moderator_ricardo",
    actor_name: "Ricardo Salas",
    actor_role: "MODERATOR",
    action_type: "UPDATE",
    module_name: "CARRUSEL",
    change_summary: "Reordenó las diapositivas de la portada principal."
  },
  {
    log_id: "audit_seed_04",
    occurred_at: "2026-10-20T11:05:00.000Z",
    actor_user_id: "user_super_alessandra",
    actor_name: "Alessandra Vesuviana",
    actor_role: "SUPER_ADMIN",
    action_type: "CREATE",
    module_name: "USUARIOS",
    change_summary: "Creó al usuario moderador Ricardo Salas."
  },
  {
    log_id: "audit_seed_05",
    occurred_at: "2026-10-20T15:22:00.000Z",
    actor_user_id: "user_moderator_camila",
    actor_name: "Camila Duarte",
    actor_role: "MODERATOR",
    action_type: "UPDATE",
    module_name: "ASESORES",
    change_summary: "Actualizó la zona de cobertura de la asesora Gabriela Pérez en Lara."
  },
  {
    log_id: "audit_seed_06",
    occurred_at: "2026-10-21T10:12:00.000Z",
    actor_user_id: "user_super_alessandra",
    actor_name: "Alessandra Vesuviana",
    actor_role: "SUPER_ADMIN",
    action_type: "UPDATE",
    module_name: "MARCAS",
    change_summary: "Actualizó los enlaces sociales de la marca Oleos."
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
