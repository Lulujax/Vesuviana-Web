import type {
  ContactContent,
  NavigationLinkContent,
  SocialLinkContent,
  StoryValueContent,
  TestimonialContent,
  ValuePillarContent,
  WholesaleBenefitContent
} from "@/core/types/vesuviana_content_types";
import { VESUVIANA_MEDIA } from "@/core/data/vesuviana_media";

export const NAVIGATION_LINKS: NavigationLinkContent[] = [
  { link_id: "nav_home", label: "Inicio", href: "/" },
  { link_id: "nav_catalog", label: "Catálogo", href: "/catalogo" },
  { link_id: "nav_wholesale", label: "Ventas al Mayor", href: "/mayoristas" },
  { link_id: "nav_distributors", label: "Distribuidores", href: "/distribuidores" },
  { link_id: "nav_about", label: "Nosotros", href: "/#nosotros" }
];

export const CORPORATE_SOCIAL_LINKS: SocialLinkContent[] = [
  { social_id: "social_instagram", network_name: "Instagram", url: "https://instagram.com/vesuvianacosmetics" },
  { social_id: "social_facebook", network_name: "Facebook", url: "https://facebook.com/vesuvianacosmetics" },
  { social_id: "social_tiktok", network_name: "TikTok", url: "https://tiktok.com/@vesuvianacosmetics" },
  { social_id: "social_youtube", network_name: "YouTube", url: "https://youtube.com/@vesuvianacosmetics" }
];

export const CONTACT_CONTENT: ContactContent = {
  whatsapp_number: "+58 412 555 0199",
  email: "hola@vesuvianacosmetics.com",
  address: "Valencia, Carabobo, Venezuela",
  schedule: "Lunes a sábado, 8:00 a 18:00"
};

export const VALUE_PILLARS: ValuePillarContent[] = [
  {
    pillar_id: "pillar_shipping",
    icon_key: "truck",
    title: "Despachos Nacionales",
    description: "Cobertura y envíos seguros a todas las ciudades y estados de Venezuela."
  },
  {
    pillar_id: "pillar_support",
    icon_key: "headset",
    title: "Atención Cercana 24/7",
    description: "Acompañamiento y asesoría personalizada antes y después de cada solicitud."
  },
  {
    pillar_id: "pillar_bio",
    icon_key: "sprout",
    title: "100% Bio-Activos y Extractos Naturales",
    description: "Tratamientos capilares con óleos vegetales puros, extractos botánicos seleccionados y activos de alta performance."
  },
  {
    pillar_id: "pillar_quality",
    icon_key: "shield",
    title: "Trayectoria y Calidad Certificada",
    description: "Años de experiencia en el país con estándares profesionales probados en salón y laboratorio."
  }
];

export const STORY_VALUES: StoryValueContent[] = [
  {
    value_id: "story_pro_formulas",
    icon_key: "flask",
    title: "Tratamientos profesionales",
    description: "Desempeño de salón con activos de alta concentración para cada tipo de cabello."
  },
  {
    value_id: "story_natural_ingredients",
    icon_key: "leaf",
    title: "Ingredientes naturales",
    description: "Óleos vegetales y extractos botánicos seleccionados por su afinidad con la fibra capilar."
  },
  {
    value_id: "story_certified_quality",
    icon_key: "badge",
    title: "Calidad certificada",
    description: "Procesos controlados, lotes trazables y estándares que respaldan cada tratamiento."
  },
  {
    value_id: "story_made_with_love",
    icon_key: "heart",
    title: "Hecho con amor",
    description: "Una casa venezolana creada por y para quienes viven el cuidado del cabello como un ritual."
  }
];

export const TESTIMONIALS: TestimonialContent[] = [
  {
    testimonial_id: "testimonial_andreina",
    customer_name: "Andreína P.",
    customer_city: "Valencia",
    brand_name: "Defile",
    message: "El alisador Defile dejó mi cabello con un brillo que no lograba con nada. Mis clientas preguntan por la marca en cada cita.",
    timestamp_label: "10:24",
    initials: "AP"
  },
  {
    testimonial_id: "testimonial_daniela",
    customer_name: "Daniela M.",
    customer_city: "Caracas",
    brand_name: "Oleos",
    message: "El óleo de argán es mi paso favorito antes de secar. Hidrata sin dejar esa sensación grasosa y huele increíble.",
    timestamp_label: "10:26",
    initials: "DM"
  },
  {
    testimonial_id: "testimonial_sofia",
    customer_name: "Sofía R.",
    customer_city: "Maracaibo",
    brand_name: "Tricomplex",
    message: "El tratamiento de ácido hialurónico devolvió la suavidad a mi cabello. Se siente hidratado sin peso y con brillo natural.",
    timestamp_label: "10:28",
    initials: "SR"
  },
  {
    testimonial_id: "testimonial_mariana",
    customer_name: "Mariana G.",
    customer_city: "Barquisimeto",
    brand_name: "Defile",
    message: "Como dueña de salón valoro que Defile tenga resultados consistentes y un respaldo real para nosotras.",
    timestamp_label: "10:31",
    initials: "MG"
  }
];

export const WHOLESALE_BENEFITS: WholesaleBenefitContent[] = [
  {
    benefit_id: "wholesale_margin",
    icon_key: "percent",
    title: "Márgenes para crecer",
    description: "Precios mayoristas competitivos y una estructura pensada para la rentabilidad de tu negocio."
  },
  {
    benefit_id: "wholesale_logistics",
    icon_key: "truck",
    title: "Logística nacional",
    description: "Despachos coordinados a todos los estados de Venezuela con seguimiento cercano."
  },
  {
    benefit_id: "wholesale_training",
    icon_key: "graduation",
    title: "Formación y asesoría",
    description: "Acompañamiento en producto, exhibición y protocolos para tu equipo de ventas."
  },
  {
    benefit_id: "wholesale_portfolio",
    icon_key: "sparkles",
    title: "Portafolio completo",
    description: "Defile, Oleos y Tricomplex para cubrir cada necesidad capilar."
  }
];

export const HERO_IMAGE_URLS = {
  hair_portrait: VESUVIANA_MEDIA.hero.campaign,
  salon_space: VESUVIANA_MEDIA.lifestyle.defile_ad,
  amber_bottle: VESUVIANA_MEDIA.lifestyle.oleos_spa,
  dark_cosmetics: VESUVIANA_MEDIA.hero.editorial
} as const;

export const STORY_IMAGE_URLS = {
  main: VESUVIANA_MEDIA.lifestyle.oleos_spa,
  secondary: VESUVIANA_MEDIA.lifestyle.defile_woman
} as const;

export const TESTIMONIAL_PHONE_IMAGE_URL = VESUVIANA_MEDIA.lifestyle.tricomplex_woman;
