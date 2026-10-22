export const VENEZUELA_STATES = [
  "Caracas",
  "Carabobo",
  "Aragua",
  "Lara",
  "Zulia",
  "Miranda",
  "Anzoátegui",
  "Bolívar",
  "Táchira",
  "Mérida",
  "Nueva Esparta",
  "Yaracuy",
  "Falcón",
  "Monagas",
  "Barinas",
  "Portuguesa"
] as const;

export type VenezuelaState = (typeof VENEZUELA_STATES)[number];

export const DEFAULT_VENEZUELA_STATE: VenezuelaState = "Carabobo";

export const IMAGE_RECOMMENDATIONS = {
  slide: {
    width: 1920,
    height: 1080,
    aspect_ratio: 16 / 9,
    label: "Carrusel de portada",
    description: "Formato panorámico para portada de escritorio y móvil."
  },
  brand: {
    width: 800,
    height: 800,
    aspect_ratio: 1,
    label: "Imagen de marca",
    description: "Formato cuadrado para tarjetas editoriales de marca."
  },
  product: {
    width: 800,
    height: 800,
    aspect_ratio: 1,
    label: "Fotografía de producto",
    description: "Formato cuadrado para catálogo y ficha de producto."
  }
} as const;

export const STORAGE_KEYS = {
  site_state: "vesuviana_cms_state_v1",
  admin_session: "vesuviana_admin_session_v1"
} as const;

export const CURRENT_SCHEMA_VERSION = 1;
export const CURRENT_SEED_VERSION = "1.0.0";

export const FALLBACK_WHATSAPP_NUMBER = "+58 412 555 0199";
export const FALLBACK_CONTACT_EMAIL = "hola@vesuvianacosmetics.com";
