import type { AdminRole, AdminUser, AuditActionType, AuditLogEntry, AuditModuleName } from "@/core/types/vesuviana_domain_types";
import { create_identifier } from "@/core/services/identifier_service";

export function create_audit_entry(
  actor: AdminUser,
  action_type: AuditActionType,
  module_name: AuditModuleName,
  change_summary: string,
  occurred_at = new Date().toISOString()
): AuditLogEntry {
  return {
    log_id: create_identifier("audit"),
    occurred_at,
    actor_user_id: actor.user_id,
    actor_name: actor.full_name,
    actor_role: actor.role,
    action_type,
    module_name,
    change_summary
  };
}

export function role_label(role: AdminRole): string {
  return role === "SUPER_ADMIN" ? "Usuario superior" : "Usuario común";
}

export function action_label(action_type: AuditActionType): string {
  const labels: Record<AuditActionType, string> = {
    CREATE: "Creación",
    UPDATE: "Actualización",
    DELETE: "Eliminación",
    BAN_USER: "Baneo",
    UNBAN_USER: "Desbaneo"
  };
  return labels[action_type];
}

export function module_label(module_name: AuditModuleName): string {
  const labels: Record<AuditModuleName, string> = {
    CARRUSEL: "Carrusel",
    MARCAS: "Marcas",
    CATEGORIAS: "Categorías",
    PRODUCTOS: "Productos",
    ASESORES: "Asesores",
    DISTRIBUIDORES: "Distribuidores",
    USUARIOS: "Usuarios",
    SISTEMA: "Sistema"
  };
  return labels[module_name];
}
