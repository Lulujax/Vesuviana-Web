import { useEffect, useMemo, useState } from "react";
import { Filter, Search, ScrollText, ShieldCheck, UserRound, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin_page_header";
import { AdminStatusBadge } from "@/components/admin/admin_status_badge";
import { EmptyState } from "@/components/shared/empty_state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { use_vesuviana_app } from "@/core/hooks/use_vesuviana_app";
import { action_label, module_label } from "@/core/services/audit_trail_service";
import { format_audit_timestamp, get_relative_time_label } from "@/core/services/date_format_service";
import type { AuditActionType, AuditModuleName } from "@/core/types/vesuviana_domain_types";

const ACTION_FILTER_OPTIONS: AuditActionType[] = ["CREATE", "UPDATE", "DELETE", "BAN_USER", "UNBAN_USER"];
const MODULE_FILTER_OPTIONS: AuditModuleName[] = [
  "CARRUSEL",
  "MARCAS",
  "CATEGORIAS",
  "PRODUCTOS",
  "ASESORES",
  "DISTRIBUIDORES",
  "USUARIOS",
  "SISTEMA"
];
const PAGE_SIZE = 20;

const get_action_tone = (action_type: AuditActionType) => {
  if (action_type === "CREATE" || action_type === "UNBAN_USER") {
    return "active" as const;
  }
  if (action_type === "DELETE" || action_type === "BAN_USER") {
    return "danger" as const;
  }
  return "role" as const;
};

export function AdminAuditPage() {
  const { site_state, all_users } = use_vesuviana_app();
  const [search_query, set_search_query] = useState("");
  const [actor_filter, set_actor_filter] = useState("all");
  const [action_filter, set_action_filter] = useState("all");
  const [module_filter, set_module_filter] = useState("all");
  const [visible_count, set_visible_count] = useState(PAGE_SIZE);

  const filtered_logs = useMemo(() => {
    const normalized_query = search_query.trim().toLowerCase();
    return site_state.audit_logs.filter((audit_log) => {
      if (actor_filter !== "all" && audit_log.actor_user_id !== actor_filter) {
        return false;
      }
      if (action_filter !== "all" && audit_log.action_type !== action_filter) {
        return false;
      }
      if (module_filter !== "all" && audit_log.module_name !== module_filter) {
        return false;
      }
      if (!normalized_query) {
        return true;
      }
      return [audit_log.change_summary, audit_log.actor_name, module_label(audit_log.module_name)]
        .join(" ")
        .toLowerCase()
        .includes(normalized_query);
    });
  }, [site_state.audit_logs, search_query, actor_filter, action_filter, module_filter]);

  useEffect(() => {
    set_visible_count(PAGE_SIZE);
  }, [search_query, actor_filter, action_filter, module_filter]);

  const clear_filters = () => {
    set_search_query("");
    set_actor_filter("all");
    set_action_filter("all");
    set_module_filter("all");
  };

  const has_filters = Boolean(search_query) || actor_filter !== "all" || action_filter !== "all" || module_filter !== "all";
  const today_logs = site_state.audit_logs.filter((audit_log) => {
    const log_date = new Date(audit_log.occurred_at);
    const today = new Date();
    return (
      log_date.getFullYear() === today.getFullYear() &&
      log_date.getMonth() === today.getMonth() &&
      log_date.getDate() === today.getDate()
    );
  }).length;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Trazabilidad"
        title="Auditoría"
        description="Cada cambio realizado en el panel queda registrado con el usuario, la acción, el módulo y la fecha. Este historial está reservado al usuario superior."
        action={<AdminStatusBadge label={`${site_state.audit_logs.length} registros`} tone="role" />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-cream/65 p-5">
          <span className="flex size-9 items-center justify-center rounded-full bg-ink text-gold-bright">
            <ScrollText className="size-4" />
          </span>
          <p className="mt-4 font-display text-3xl text-ink">{site_state.audit_logs.length}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.1em] text-stone">Movimientos guardados</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream/65 p-5">
          <span className="flex size-9 items-center justify-center rounded-full bg-sand text-gold-deep">
            <Filter className="size-4" />
          </span>
          <p className="mt-4 font-display text-3xl text-ink">{today_logs}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.1em] text-stone">Movimientos hoy</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream/65 p-5">
          <span className="flex size-9 items-center justify-center rounded-full bg-sand text-gold-deep">
            <UserRound className="size-4" />
          </span>
          <p className="mt-4 font-display text-3xl text-ink">{all_users.filter((user_item) => user_item.role === "MODERATOR").length}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.1em] text-stone">Moderadores registrados</p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-line bg-cream/60 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_13rem_12rem_12rem]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/60" />
            <Input
              value={search_query}
              onChange={(event) => set_search_query(event.target.value)}
              placeholder="Buscar en el resumen o por usuario..."
              className="h-10 rounded-full bg-white/70 pl-10"
              aria-label="Buscar en auditoría"
            />
          </div>
          <Select value={actor_filter} onValueChange={set_actor_filter}>
            <SelectTrigger className="h-10 rounded-full" aria-label="Filtrar por usuario">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usuarios</SelectItem>
              {all_users.map((user_item) => (
                <SelectItem key={user_item.user_id} value={user_item.user_id}>
                  {user_item.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={action_filter} onValueChange={set_action_filter}>
            <SelectTrigger className="h-10 rounded-full" aria-label="Filtrar por acción">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las acciones</SelectItem>
              {ACTION_FILTER_OPTIONS.map((action_type) => (
                <SelectItem key={action_type} value={action_type}>
                  {action_label(action_type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={module_filter} onValueChange={set_module_filter}>
            <SelectTrigger className="h-10 rounded-full" aria-label="Filtrar por módulo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los módulos</SelectItem>
              {MODULE_FILTER_OPTIONS.map((module_name) => (
                <SelectItem key={module_name} value={module_name}>
                  {module_label(module_name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.68rem] text-stone">
            {filtered_logs.length} {filtered_logs.length === 1 ? "resultado" : "resultados"}
            {has_filters ? " con los filtros activos" : " en total"}
          </p>
          {has_filters ? (
            <Button variant="ghost" size="sm" onClick={clear_filters}>
              <X className="size-3.5" />
              Limpiar filtros
            </Button>
          ) : null}
        </div>
      </div>

      {filtered_logs.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-cream/65">
          <ol className="divide-y divide-line">
            {filtered_logs.slice(0, visible_count).map((audit_log) => (
              <li key={audit_log.log_id} className="grid gap-3 p-4 sm:grid-cols-[10rem_1fr_auto] sm:items-start sm:gap-5 sm:p-5">
                <div className="text-[0.66rem] text-stone/60">
                  <p className="font-medium text-stone">{get_relative_time_label(audit_log.occurred_at)}</p>
                  <p className="mt-0.5">{format_audit_timestamp(audit_log.occurred_at)}</p>
                </div>
                <div>
                  <p className="text-[0.82rem] leading-relaxed text-ink">{audit_log.change_summary}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.64rem] text-stone/65">
                    <span>{audit_log.actor_name}</span>
                    <span className="size-1 rounded-full bg-line" />
                    <span>{module_label(audit_log.module_name)}</span>
                  </div>
                </div>
                <AdminStatusBadge
                  label={action_label(audit_log.action_type)}
                  tone={get_action_tone(audit_log.action_type)}
                  className="w-fit"
                />
              </li>
            ))}
          </ol>
          {visible_count < filtered_logs.length ? (
            <div className="border-t border-line p-4 text-center">
              <Button variant="outline" onClick={() => set_visible_count((current_count) => current_count + PAGE_SIZE)}>
                Mostrar más movimientos
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState
          icon={ScrollText}
          title="No hay movimientos con esos filtros"
          description="Limpia los filtros para revisar el historial completo o realiza un cambio desde cualquier módulo del panel."
          action={
            has_filters ? (
              <Button variant="outline" onClick={clear_filters}>
                Limpiar filtros
              </Button>
            ) : undefined
          }
        />
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-line bg-sand/35 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold-deep" />
        <div>
          <p className="text-sm font-medium text-ink">Historial local de la sesión</p>
          <p className="mt-1 text-[0.74rem] leading-relaxed text-stone">
            La auditoría se conserva en el almacenamiento del navegador y mantiene los últimos 600 movimientos. Al
            restaurar los datos de fábrica, el historial vuelve a su estado inicial.
          </p>
        </div>
      </div>
    </div>
  );
}
