import { createContext } from "react";
import type {
  AdminUser,
  AdvisorInput,
  BrandInput,
  CategoryInput,
  DistributorInput,
  ModeratorInput,
  ProductInput,
  SlideInput,
  VesuvianaSiteState
} from "@/core/types/vesuviana_domain_types";

export interface VesuvianaAppContextValue {
  site_state: VesuvianaSiteState;
  active_user: AdminUser;
  all_users: AdminUser[];
  is_super_admin: boolean;
  can_manage_content: boolean;
  storage_usage_bytes: number;
  select_active_user: (user_id: string) => void;
  create_slide: (input: SlideInput) => void;
  update_slide: (slide_id: string, input: SlideInput) => void;
  delete_slide: (slide_id: string) => void;
  move_slide: (slide_id: string, direction: "up" | "down") => void;
  create_brand: (input: BrandInput) => void;
  update_brand: (brand_id: string, input: BrandInput) => void;
  delete_brand: (brand_id: string) => void;
  create_category: (input: CategoryInput) => void;
  update_category: (category_id: string, input: CategoryInput) => void;
  delete_category: (category_id: string) => void;
  create_product: (input: ProductInput) => void;
  update_product: (product_id: string, input: ProductInput) => void;
  delete_product: (product_id: string) => void;
  create_advisor: (input: AdvisorInput) => void;
  update_advisor: (advisor_id: string, input: AdvisorInput) => void;
  delete_advisor: (advisor_id: string) => void;
  create_distributor: (input: DistributorInput) => void;
  update_distributor: (distributor_id: string, input: DistributorInput) => void;
  delete_distributor: (distributor_id: string) => void;
  create_moderator: (input: ModeratorInput) => void;
  set_user_ban_status: (user_id: string, should_be_banned: boolean) => void;
  restore_factory_data: () => void;
}

export const VesuvianaAppContext = createContext<VesuvianaAppContextValue | undefined>(undefined);
