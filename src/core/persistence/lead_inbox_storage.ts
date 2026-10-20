import { B2BLeadRecord } from "../entities/b2b_lead";

const lead_inbox_storage_key = "vesuviana_b2b_lead_inbox";

export function read_lead_inbox(): B2BLeadRecord[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored_payload = window.localStorage.getItem(lead_inbox_storage_key);
    if (stored_payload === null) {
      return [];
    }
    const parsed_payload: unknown = JSON.parse(stored_payload);
    if (!Array.isArray(parsed_payload)) {
      return [];
    }
    return parsed_payload.filter(is_valid_lead_record);
  } catch {
    return [];
  }
}

export function save_lead_record(lead_record: B2BLeadRecord): void {
  if (typeof window === "undefined") {
    return;
  }
  const current_records = read_lead_inbox();
  const deduplicated_records = current_records.filter(
    (current_record) => current_record.lead_id !== lead_record.lead_id,
  );
  window.localStorage.setItem(
    lead_inbox_storage_key,
    JSON.stringify([lead_record, ...deduplicated_records]),
  );
}

export function update_stored_lead_status(
  lead_id: string,
  new_status: B2BLeadRecord["status"],
  new_status_label: string,
): B2BLeadRecord[] {
  if (typeof window === "undefined") {
    return [];
  }
  const updated_records = read_lead_inbox().map((lead_record) =>
    lead_record.lead_id === lead_id
      ? { ...lead_record, status: new_status, status_label: new_status_label }
      : lead_record,
  );
  window.localStorage.setItem(lead_inbox_storage_key, JSON.stringify(updated_records));
  return updated_records;
}

export function remove_stored_lead(lead_id: string): B2BLeadRecord[] {
  if (typeof window === "undefined") {
    return [];
  }
  const remaining_records = read_lead_inbox().filter((lead_record) => lead_record.lead_id !== lead_id);
  window.localStorage.setItem(lead_inbox_storage_key, JSON.stringify(remaining_records));
  return remaining_records;
}

function is_valid_lead_record(value: unknown): value is B2BLeadRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate_record = value as Partial<B2BLeadRecord>;
  return (
    typeof candidate_record.lead_id === "string" &&
    typeof candidate_record.email === "string" &&
    typeof candidate_record.created_at === "string" &&
    typeof candidate_record.status === "string"
  );
}
