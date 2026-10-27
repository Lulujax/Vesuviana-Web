export type AdminRole = "SUPER_ADMIN" | "MODERATOR";

export type AuditActionType = "CREATE" | "UPDATE" | "DELETE" | "BAN_USER" | "UNBAN_USER";

export type AuditModuleName =
  | "CARRUSEL"
  | "MARCAS"
  | "CATEGORIAS"
  | "PRODUCTOS"
  | "ASESORES"
  | "DISTRIBUIDORES"
  | "USUARIOS"
  | "SISTEMA";

export type ImageAssetKind = "slide" | "brand" | "product";

export type ImageWarningSeverity = "success" | "info" | "warning";

export interface VesuvianaBrand {
  brand_id: string;
  brand_slug: string;
  brand_name: string;
  brand_description: string;
  image_url: string;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VesuvianaCategory {
  category_id: string;
  brand_id: string;
  category_name: string;
  category_slug: string;
  category_description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VesuvianaProduct {
  product_id: string;
  product_slug: string;
  brand_id: string;
  category_id: string;
  product_name: string;
  product_description: string;
  product_benefits: string[];
  image_urls: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VesuvianaCarouselSlide {
  slide_id: string;
  slide_subtitle: string;
  slide_title: string;
  slide_description: string;
  cta_label: string;
  cta_href: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WholesaleAdvisor {
  advisor_id: string;
  advisor_name: string;
  state_name: string;
  zone_name: string;
  whatsapp_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthorizedDistributor {
  distributor_id: string;
  store_name: string;
  state_name: string;
  zone_name: string;
  address_line: string;
  whatsapp_number: string;
  instagram_handle_or_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  user_id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  is_banned: boolean;
  password_salt: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  user_id: string;
  issued_at: string;
}

export interface AuditLogEntry {
  log_id: string;
  occurred_at: string;
  actor_user_id: string;
  actor_name: string;
  actor_role: AdminRole;
  action_type: AuditActionType;
  module_name: AuditModuleName;
  change_summary: string;
}

export interface VesuvianaSiteState {
  schema_version: number;
  seed_version: string;
  brands: VesuvianaBrand[];
  categories: VesuvianaCategory[];
  products: VesuvianaProduct[];
  carousel_slides: VesuvianaCarouselSlide[];
  wholesale_advisors: WholesaleAdvisor[];
  distributors: AuthorizedDistributor[];
  users: AdminUser[];
  audit_logs: AuditLogEntry[];
  last_updated_at: string;
}

export interface SlideInput {
  slide_subtitle: string;
  slide_title: string;
  slide_description: string;
  cta_label: string;
  cta_href: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface BrandInput {
  brand_name: string;
  brand_description: string;
  image_url: string;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface CategoryInput {
  brand_id: string;
  category_name: string;
  category_description: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductInput {
  brand_id: string;
  category_id: string;
  product_name: string;
  product_description: string;
  product_benefits: string[];
  image_urls: string[];
  is_featured: boolean;
  is_active: boolean;
}

export interface AdvisorInput {
  advisor_name: string;
  state_name: string;
  zone_name: string;
  whatsapp_number: string;
  is_active: boolean;
}

export interface DistributorInput {
  store_name: string;
  state_name: string;
  zone_name: string;
  address_line: string;
  whatsapp_number: string;
  instagram_handle_or_url: string;
  is_active: boolean;
}

export interface ModeratorInput {
  full_name: string;
  email: string;
  password: string;
}

export interface ImageAdaptationWarning {
  detected_width: number;
  detected_height: number;
  recommended_width: number;
  recommended_height: number;
  output_width: number;
  output_height: number;
  was_cropped: boolean;
  was_downscaled: boolean;
  message: string;
  severity: ImageWarningSeverity;
}

export interface ImageInspectionResult {
  image_url: string;
  detected_width: number;
  detected_height: number;
  is_data_url: boolean;
  warning: ImageAdaptationWarning | null;
}

export interface FieldErrorMap {
  [field_name: string]: string;
}

export interface MutationAuditInput {
  action_type: AuditActionType;
  module_name: AuditModuleName;
  change_summary: string;
}
