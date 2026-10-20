export type BrandCode = "defile" | "tricomplex" | "oleos";

export type CommercialLevel = "home_care" | "technical_formulation" | "professional";

export type ProductFormat =
  | "shampoo"
  | "conditioner"
  | "cream_bath"
  | "mask"
  | "ampoule"
  | "serum"
  | "oil"
  | "body_fluid";

export type ProductPurpose =
  | "detox"
  | "deep_cleansing"
  | "tone_correction"
  | "hydration"
  | "restructuring"
  | "bond_repair"
  | "thermal_protection"
  | "frizz_control"
  | "shine"
  | "lipid_sealing"
  | "elasticity"
  | "nutrition";

export type AnatomicalLayer = "cortex" | "cuticle_scalp" | "exterior_shield";

export type ProductIllustration =
  | "shampoo_bottle"
  | "mask_jar"
  | "technical_ampoule"
  | "dropper_bottle"
  | "oil_flask"
  | "molecular_structure";

export type ColombianRegion = "andina" | "caribe" | "pacifica" | "orinoquia" | "amazonia";

export type LeadIntent = "wholesale_interest" | "advisor_contact" | "o2o_visit";

export type BusinessProfile = "salon" | "stylist" | "distributor" | "retail_store";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export type LeadSourceChannel = "catalog" | "b2b_portal" | "o2o_store";

export const lead_intents: readonly LeadIntent[] = ["wholesale_interest", "advisor_contact", "o2o_visit"];

export const brand_codes: readonly BrandCode[] = ["defile", "tricomplex", "oleos"];

export const brand_labels: Record<BrandCode, string> = {
  defile: "Defilé",
  tricomplex: "Tricomplex",
  oleos: "Oleo's",
};

export const brand_category_labels: Record<BrandCode, string> = {
  defile: "Mantenimiento diario",
  tricomplex: "Terapia de choque",
  oleos: "Escudo exterior",
};

export const brand_promises: Record<BrandCode, string> = {
  defile: "Limpieza, hidratación y cuidado de cutícula y piel.",
  tricomplex: "Rescate estructural en la corteza profunda.",
  oleos: "Sellado lipídico, brillo y protección térmica.",
};

export const commercial_levels: readonly CommercialLevel[] = [
  "home_care",
  "technical_formulation",
  "professional",
];

export const commercial_level_labels: Record<CommercialLevel, string> = {
  home_care: "Cuidado en casa",
  technical_formulation: "Formulación técnica",
  professional: "Nivel profesional",
};

export const product_formats: readonly ProductFormat[] = [
  "shampoo",
  "conditioner",
  "cream_bath",
  "mask",
  "ampoule",
  "serum",
  "oil",
  "body_fluid",
];

export const product_format_labels: Record<ProductFormat, string> = {
  shampoo: "Champú",
  conditioner: "Acondicionador",
  cream_bath: "Baño de crema",
  mask: "Mascarilla",
  ampoule: "Ampolla",
  serum: "Sérum",
  oil: "Óleo",
  body_fluid: "Fluido corporal",
};

export const product_purposes: readonly ProductPurpose[] = [
  "detox",
  "deep_cleansing",
  "tone_correction",
  "hydration",
  "restructuring",
  "bond_repair",
  "thermal_protection",
  "frizz_control",
  "shine",
  "lipid_sealing",
  "elasticity",
  "nutrition",
];

export const product_purpose_labels: Record<ProductPurpose, string> = {
  detox: "Detox",
  deep_cleansing: "Limpieza profunda",
  tone_correction: "Matización",
  hydration: "Hidratación",
  restructuring: "Reestructuración",
  bond_repair: "Reparación de enlaces",
  thermal_protection: "Protección térmica",
  frizz_control: "Control de frizz",
  shine: "Brillo espejo",
  lipid_sealing: "Sellado lipídico",
  elasticity: "Elasticidad",
  nutrition: "Nutrición",
};

export const anatomical_layer_labels: Record<AnatomicalLayer, string> = {
  cortex: "Corteza profunda",
  cuticle_scalp: "Cutícula y cuero cabelludo",
  exterior_shield: "Escudo exterior",
};

export const anatomical_layer_descriptions: Record<AnatomicalLayer, string> = {
  cortex: "La zona que sostiene la fuerza, la elasticidad y la memoria de forma de la fibra.",
  cuticle_scalp: "La primera superficie de contacto: limpieza, hidratación y equilibrio del cuero cabelludo.",
  exterior_shield: "La película lipídica que reduce fricción, frizz y pérdida de agua.",
};

export const colombian_regions: readonly ColombianRegion[] = [
  "andina",
  "caribe",
  "pacifica",
  "orinoquia",
  "amazonia",
];

export const colombian_region_labels: Record<ColombianRegion, string> = {
  andina: "Región Andina",
  caribe: "Región Caribe",
  pacifica: "Región Pacífica",
  orinoquia: "Región Orinoquía",
  amazonia: "Región Amazonía",
};

export const lead_intent_labels: Record<LeadIntent, string> = {
  wholesale_interest: "Interés mayorista",
  advisor_contact: "Contacto con asesor",
  o2o_visit: "Visita a tienda física",
};

export const business_profiles: readonly BusinessProfile[] = [
  "salon",
  "stylist",
  "distributor",
  "retail_store",
];

export const business_profile_labels: Record<BusinessProfile, string> = {
  salon: "Salón de belleza",
  stylist: "Estilista independiente",
  distributor: "Distribuidor",
  retail_store: "Tienda de retail",
};

export const lead_statuses: readonly LeadStatus[] = ["new", "contacted", "qualified", "closed"];

export const lead_status_labels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  closed: "Cerrado",
};

export const lead_source_channels: readonly LeadSourceChannel[] = ["catalog", "b2b_portal", "o2o_store"];

export const lead_source_channel_labels: Record<LeadSourceChannel, string> = {
  catalog: "Catálogo",
  b2b_portal: "Portal B2B",
  o2o_store: "Tienda O2O",
};
