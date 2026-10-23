import { useRef, useState, useEffect, type ReactNode } from "react";
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
import { VesuvianaAppContext } from "@/core/store/vesuviana_app_context";
import {
  clear_admin_session,
  get_storage_usage_bytes,
  load_admin_session,
  load_site_state,
  restore_factory_site_state,
  save_admin_session,
  save_site_state,
  subscribe_to_storage_changes
} from "@/core/repositories/vesuviana_local_repository";
import { create_audit_entry } from "@/core/services/audit_trail_service";
import { generate_password_salt, hash_password, verify_password } from "@/core/services/auth_service";
import {
  assert_can_manage_content,
  assert_super_admin,
  validate_advisor_input,
  validate_brand_input,
  validate_category_input,
  validate_distributor_input,
  validate_moderator_input,
  validate_password_reset,
  validate_product_input,
  validate_site_state,
  validate_slide_input
} from "@/core/validation/vesuviana_validation_service";
import {
  create_advisor_mutation,
  create_brand_mutation,
  create_category_mutation,
  create_distributor_mutation,
  create_moderator_mutation,
  create_product_mutation,
  create_slide_mutation,
  delete_advisor_mutation,
  delete_brand_mutation,
  delete_category_mutation,
  delete_distributor_mutation,
  delete_product_mutation,
  delete_slide_mutation,
  move_slide_mutation,
  reset_user_password_mutation,
  set_user_ban_mutation,
  update_advisor_mutation,
  update_brand_mutation,
  update_category_mutation,
  update_distributor_mutation,
  update_product_mutation,
  update_slide_mutation,
  type StateMutationResult
} from "@/core/store/vesuviana_state_mutations";
import { VesuvianaAuthorizationException, VesuvianaNotFoundException } from "@/core/exceptions/vesuviana_domain_exceptions";

const resolve_session_user = (state: VesuvianaSiteState, user_id: string | null): AdminUser | null => {
  if (!user_id) {
    return null;
  }
  return state.users.find((user_item) => user_item.user_id === user_id) || null;
};

export function VesuvianaAppProvider({ children }: { children: ReactNode }) {
  const [site_state, set_site_state] = useState<VesuvianaSiteState>(() => load_site_state());
  const [session_user_id, set_session_user_id] = useState<string | null>(() => {
    const session = load_admin_session();
    const state = load_site_state();
    return session && state.users.some((user_item) => user_item.user_id === session.user_id)
      ? session.user_id
      : null;
  });
  const [storage_usage_bytes, set_storage_usage_bytes] = useState<number>(() => get_storage_usage_bytes());
  const site_state_ref = useRef(site_state);
  const session_user_id_ref = useRef(session_user_id);

  site_state_ref.current = site_state;
  session_user_id_ref.current = session_user_id;

  useEffect(() => {
    const unsubscribe = subscribe_to_storage_changes((next_state) => {
      site_state_ref.current = next_state;
      set_site_state(next_state);
      set_storage_usage_bytes(get_storage_usage_bytes());
    });
    return unsubscribe;
  }, []);

  const active_user = resolve_session_user(site_state, session_user_id);

  const require_session_user = (): AdminUser => {
    const current_user = resolve_session_user(site_state_ref.current, session_user_id_ref.current);
    if (!current_user) {
      throw new VesuvianaAuthorizationException("Inicia sesión para continuar.");
    }
    return current_user;
  };

  const commit_mutation = (mutation_result: StateMutationResult, actor: AdminUser) => {
    const audit_entry = create_audit_entry(
      actor,
      mutation_result.audit_input.action_type,
      mutation_result.audit_input.module_name,
      mutation_result.audit_input.change_summary
    );
    const next_state: VesuvianaSiteState = {
      ...mutation_result.next_state,
      audit_logs: [audit_entry, ...mutation_result.next_state.audit_logs].slice(0, 600)
    };
    validate_site_state(next_state);
    save_site_state(next_state);
    site_state_ref.current = next_state;
    set_site_state(next_state);
    set_storage_usage_bytes(get_storage_usage_bytes());
  };

  const run_content_mutation = (create_result: (state: VesuvianaSiteState, actor: AdminUser) => StateMutationResult) => {
    const current_state = site_state_ref.current;
    const current_user = require_session_user();
    assert_can_manage_content(current_user);
    commit_mutation(create_result(current_state, current_user), current_user);
  };

  const run_super_admin_mutation = (create_result: (state: VesuvianaSiteState, actor: AdminUser) => StateMutationResult) => {
    const current_state = site_state_ref.current;
    const current_user = require_session_user();
    assert_super_admin(current_user);
    commit_mutation(create_result(current_state, current_user), current_user);
  };

  const login = async (email: string, password: string): Promise<AdminUser> => {
    const normalized_email = email.trim().toLowerCase();
    const target_user = site_state_ref.current.users.find(
      (user_item) => user_item.email.toLowerCase() === normalized_email
    );
    if (!target_user || !(await verify_password(target_user, password))) {
      throw new VesuvianaAuthorizationException("Correo o contraseña incorrectos.");
    }
    if (target_user.is_banned) {
      throw new VesuvianaAuthorizationException("Esta cuenta está suspendida. Contacta al usuario superior.");
    }
    save_admin_session(target_user.user_id);
    session_user_id_ref.current = target_user.user_id;
    set_session_user_id(target_user.user_id);
    return target_user;
  };

  const logout = () => {
    clear_admin_session();
    session_user_id_ref.current = null;
    set_session_user_id(null);
  };

  const create_slide = (input: SlideInput) => {
    run_content_mutation((current_state) => {
      validate_slide_input(input);
      return create_slide_mutation(current_state, input);
    });
  };

  const update_slide = (slide_id: string, input: SlideInput) => {
    run_content_mutation((current_state) => {
      validate_slide_input(input);
      return update_slide_mutation(current_state, slide_id, input);
    });
  };

  const delete_slide = (slide_id: string) => {
    run_content_mutation((current_state) => delete_slide_mutation(current_state, slide_id));
  };

  const move_slide = (slide_id: string, direction: "up" | "down") => {
    run_content_mutation((current_state) => move_slide_mutation(current_state, slide_id, direction));
  };

  const create_brand = (input: BrandInput) => {
    run_content_mutation((current_state) => {
      validate_brand_input(input, current_state);
      return create_brand_mutation(current_state, input);
    });
  };

  const update_brand = (brand_id: string, input: BrandInput) => {
    run_content_mutation((current_state) => {
      validate_brand_input(input, current_state, brand_id);
      return update_brand_mutation(current_state, brand_id, input);
    });
  };

  const delete_brand = (brand_id: string) => {
    run_content_mutation((current_state) => delete_brand_mutation(current_state, brand_id));
  };

  const create_category = (input: CategoryInput) => {
    run_content_mutation((current_state) => {
      validate_category_input(input, current_state);
      return create_category_mutation(current_state, input);
    });
  };

  const update_category = (category_id: string, input: CategoryInput) => {
    run_content_mutation((current_state) => {
      validate_category_input(input, current_state, category_id);
      return update_category_mutation(current_state, category_id, input);
    });
  };

  const delete_category = (category_id: string) => {
    run_content_mutation((current_state) => delete_category_mutation(current_state, category_id));
  };

  const create_product = (input: ProductInput) => {
    run_content_mutation((current_state) => {
      validate_product_input(input, current_state);
      return create_product_mutation(current_state, input);
    });
  };

  const update_product = (product_id: string, input: ProductInput) => {
    run_content_mutation((current_state) => {
      validate_product_input(input, current_state, product_id);
      return update_product_mutation(current_state, product_id, input);
    });
  };

  const delete_product = (product_id: string) => {
    run_content_mutation((current_state) => delete_product_mutation(current_state, product_id));
  };

  const create_advisor = (input: AdvisorInput) => {
    run_content_mutation((current_state) => {
      validate_advisor_input(input, current_state);
      return create_advisor_mutation(current_state, input);
    });
  };

  const update_advisor = (advisor_id: string, input: AdvisorInput) => {
    run_content_mutation((current_state) => {
      validate_advisor_input(input, current_state, advisor_id);
      return update_advisor_mutation(current_state, advisor_id, input);
    });
  };

  const delete_advisor = (advisor_id: string) => {
    run_content_mutation((current_state) => delete_advisor_mutation(current_state, advisor_id));
  };

  const create_distributor = (input: DistributorInput) => {
    run_content_mutation((current_state) => {
      validate_distributor_input(input, current_state);
      return create_distributor_mutation(current_state, input);
    });
  };

  const update_distributor = (distributor_id: string, input: DistributorInput) => {
    run_content_mutation((current_state) => {
      validate_distributor_input(input, current_state, distributor_id);
      return update_distributor_mutation(current_state, distributor_id, input);
    });
  };

  const delete_distributor = (distributor_id: string) => {
    run_content_mutation((current_state) => delete_distributor_mutation(current_state, distributor_id));
  };

  const create_moderator = async (input: ModeratorInput) => {
    validate_moderator_input(input, site_state_ref.current);
    const password_salt = generate_password_salt();
    const password_hash = await hash_password(input.password, password_salt);
    run_super_admin_mutation((current_state) =>
      create_moderator_mutation(current_state, input, password_hash, password_salt)
    );
  };

  const reset_user_password = async (user_id: string, new_password: string) => {
    validate_password_reset(new_password);
    const password_salt = generate_password_salt();
    const password_hash = await hash_password(new_password, password_salt);
    run_super_admin_mutation((current_state) =>
      reset_user_password_mutation(current_state, user_id, password_hash, password_salt)
    );
  };

  const set_user_ban_status = (user_id: string, should_be_banned: boolean) => {
    run_super_admin_mutation((current_state, current_user) => {
      if (current_user.user_id === user_id) {
        throw new VesuvianaAuthorizationException("No puedes suspender tu propia sesión activa.");
      }
      return set_user_ban_mutation(current_state, user_id, should_be_banned);
    });
  };

  const restore_factory_data = () => {
    const current_user = require_session_user();
    assert_super_admin(current_user);
    const factory_state = restore_factory_site_state();
    const super_admin = factory_state.users.find((user_item) => user_item.role === "SUPER_ADMIN");
    if (!super_admin) {
      throw new VesuvianaNotFoundException("No encontramos al usuario superior de fábrica.");
    }
    const audit_entry = create_audit_entry(
      super_admin,
      "UPDATE",
      "SISTEMA",
      "Restauró todos los datos de fábrica de Vesuviana Cosmetics."
    );
    const restored_state: VesuvianaSiteState = {
      ...factory_state,
      audit_logs: [audit_entry, ...factory_state.audit_logs]
    };
    save_site_state(restored_state);
    save_admin_session(super_admin.user_id);
    session_user_id_ref.current = super_admin.user_id;
    set_session_user_id(super_admin.user_id);
    site_state_ref.current = restored_state;
    set_site_state(restored_state);
    set_storage_usage_bytes(get_storage_usage_bytes());
  };

  const context_value = {
    site_state,
    active_user,
    all_users: site_state.users,
    is_super_admin: active_user?.role === "SUPER_ADMIN",
    can_manage_content: Boolean(active_user && active_user.role === "MODERATOR" && !active_user.is_banned),
    storage_usage_bytes,
    login,
    logout,
    create_slide,
    update_slide,
    delete_slide,
    move_slide,
    create_brand,
    update_brand,
    delete_brand,
    create_category,
    update_category,
    delete_category,
    create_product,
    update_product,
    delete_product,
    create_advisor,
    update_advisor,
    delete_advisor,
    create_distributor,
    update_distributor,
    delete_distributor,
    create_moderator,
    reset_user_password,
    set_user_ban_status,
    restore_factory_data
  };

  return <VesuvianaAppContext.Provider value={context_value}>{children}</VesuvianaAppContext.Provider>;
}
