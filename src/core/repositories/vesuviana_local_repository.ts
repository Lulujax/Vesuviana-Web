import type { AdminSession, VesuvianaSiteState } from "@/core/types/vesuviana_domain_types";
import { create_factory_state } from "@/core/data/vesuviana_initial_seed";
import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_SEED_VERSION,
  STORAGE_KEYS
} from "@/core/constants/vesuviana_constants";
import { validate_site_state } from "@/core/validation/vesuviana_validation_service";
import { VesuvianaStorageException } from "@/core/exceptions/vesuviana_domain_exceptions";

const get_storage = (): Storage => {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new VesuvianaStorageException("El almacenamiento local no está disponible en este navegador.");
  }
  return window.localStorage;
};

const persist_factory_state = (): VesuvianaSiteState => {
  const factory_state = create_factory_state();
  try {
    get_storage().setItem(STORAGE_KEYS.site_state, JSON.stringify(factory_state));
  } catch {
    return factory_state;
  }
  return factory_state;
};

export function load_site_state(): VesuvianaSiteState {
  try {
    const raw_value = get_storage().getItem(STORAGE_KEYS.site_state);
    if (!raw_value) {
      return persist_factory_state();
    }
    const parsed_state = JSON.parse(raw_value) as VesuvianaSiteState;
    if (
      parsed_state.schema_version !== CURRENT_SCHEMA_VERSION ||
      parsed_state.seed_version !== CURRENT_SEED_VERSION
    ) {
      return persist_factory_state();
    }
    validate_site_state(parsed_state);
    return parsed_state;
  } catch {
    return persist_factory_state();
  }
}

export function save_site_state(state: VesuvianaSiteState) {
  try {
    get_storage().setItem(STORAGE_KEYS.site_state, JSON.stringify(state));
  } catch (error) {
    const is_quota_error =
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED");
    if (is_quota_error) {
      throw new VesuvianaStorageException(
        "El almacenamiento local está lleno. Usa URLs de imagen o elimina contenido para liberar espacio."
      );
    }
    throw new VesuvianaStorageException("No pudimos guardar los cambios en el navegador.");
  }
}

export function load_admin_session(): AdminSession | null {
  try {
    const raw_value = get_storage().getItem(STORAGE_KEYS.admin_session);
    if (!raw_value) {
      return null;
    }
    const parsed_session = JSON.parse(raw_value) as AdminSession;
    return parsed_session.user_id ? parsed_session : null;
  } catch {
    return null;
  }
}

export function save_admin_session(user_id: string) {
  try {
    get_storage().setItem(
      STORAGE_KEYS.admin_session,
      JSON.stringify({ user_id, issued_at: new Date().toISOString() } satisfies AdminSession)
    );
  } catch {
    throw new VesuvianaStorageException("No pudimos guardar la sesión activa.");
  }
}

export function clear_admin_session() {
  try {
    get_storage().removeItem(STORAGE_KEYS.admin_session);
  } catch {
    throw new VesuvianaStorageException("No pudimos cerrar la sesión.");
  }
}

export function restore_factory_site_state(): VesuvianaSiteState {
  const factory_state = create_factory_state();
  save_site_state(factory_state);
  const super_admin = factory_state.users.find((user_item) => user_item.role === "SUPER_ADMIN");
  if (super_admin) {
    save_admin_session(super_admin.user_id);
  }
  return factory_state;
}

export function subscribe_to_storage_changes(callback: (state: VesuvianaSiteState) => void) {
  const handle_storage_change = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEYS.site_state || !event.newValue) {
      return;
    }
    try {
      const next_state = JSON.parse(event.newValue) as VesuvianaSiteState;
      validate_site_state(next_state);
      callback(next_state);
    } catch {
      const factory_state = create_factory_state();
      callback(factory_state);
    }
  };
  window.addEventListener("storage", handle_storage_change);
  return () => window.removeEventListener("storage", handle_storage_change);
}

export function get_storage_usage_bytes(): number {
  try {
    const raw_state = get_storage().getItem(STORAGE_KEYS.site_state) || "";
    return new Blob([raw_state]).size;
  } catch {
    return 0;
  }
}
