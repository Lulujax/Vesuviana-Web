import {
  BusinessProfile,
  business_profile_labels,
  business_profiles,
  LeadIntent,
  lead_intent_labels,
  lead_intents,
  LeadSourceChannel,
  lead_source_channel_labels,
  lead_source_channels,
  LeadStatus,
  lead_status_labels,
  lead_statuses,
} from "../domain/product_classification";
import { DomainValidationException } from "../exceptions/domain_validation_exception";
import { DomainGuard } from "../validation/domain_guard";

export interface B2BLeadSeed {
  lead_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  business_profile: BusinessProfile;
  department: string;
  city: string;
  advisor_id?: string | null;
  product_sku?: string | null;
  intent: LeadIntent;
  source_channel: LeadSourceChannel;
  estimated_monthly_volume: number;
  created_at: string;
  initial_note?: string;
}

export interface B2BLeadRecord {
  lead_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  business_profile: BusinessProfile;
  business_profile_label: string;
  department: string;
  city: string;
  advisor_id: string | null;
  product_sku: string | null;
  intent: LeadIntent;
  intent_label: string;
  source_channel: LeadSourceChannel;
  source_channel_label: string;
  estimated_monthly_volume: number;
  status: LeadStatus;
  status_label: string;
  created_at: string;
  notes: string[];
}

export class B2BLead {
  private readonly lead_identifier: string;
  private readonly company_value: string;
  private readonly contact_name_value: string;
  private readonly contact_email: string;
  private readonly contact_phone: string;
  private readonly profile_value: BusinessProfile;
  private readonly department_value: string;
  private readonly city_value: string;
  private readonly advisor_identifier: string | null;
  private readonly product_identifier: string | null;
  private readonly intent_value: LeadIntent;
  private readonly source_value: LeadSourceChannel;
  private readonly monthly_volume: number;
  private readonly created_timestamp: string;
  private current_status: LeadStatus;
  private lead_notes: string[];

  constructor(seed_data: B2BLeadSeed) {
    this.lead_identifier = DomainGuard.require_non_empty_string(seed_data.lead_id, "lead_id");
    this.company_value = DomainGuard.require_non_empty_string(seed_data.company_name, "company_name");
    this.contact_name_value = DomainGuard.require_non_empty_string(seed_data.contact_name, "contact_name");
    this.contact_email = DomainGuard.require_email(seed_data.email, "email");
    this.contact_phone = DomainGuard.require_phone(seed_data.phone, "phone");
    this.profile_value = DomainGuard.require_enum_value(
      seed_data.business_profile,
      business_profiles,
      "business_profile",
    );
    this.department_value = DomainGuard.require_non_empty_string(seed_data.department, "department");
    this.city_value = DomainGuard.require_non_empty_string(seed_data.city, "city");
    this.advisor_identifier = seed_data.advisor_id
      ? DomainGuard.require_non_empty_string(seed_data.advisor_id, "advisor_id")
      : null;
    this.product_identifier = seed_data.product_sku
      ? DomainGuard.require_non_empty_string(seed_data.product_sku, "product_sku")
      : null;
    this.intent_value = DomainGuard.require_enum_value(
      seed_data.intent,
      lead_intents,
      "intent",
    );
    this.source_value = DomainGuard.require_enum_value(
      seed_data.source_channel,
      lead_source_channels,
      "source_channel",
    );
    this.monthly_volume = DomainGuard.require_positive_integer(
      seed_data.estimated_monthly_volume,
      "estimated_monthly_volume",
    );
    this.created_timestamp = DomainGuard.require_iso_timestamp(seed_data.created_at, "created_at");
    this.current_status = "new";
    this.lead_notes = seed_data.initial_note
      ? [DomainGuard.require_non_empty_string(seed_data.initial_note, "initial_note")]
      : [];
  }

  get lead_id(): string {
    return this.lead_identifier;
  }

  get company_name(): string {
    return this.company_value;
  }

  get contact_name(): string {
    return this.contact_name_value;
  }

  get email(): string {
    return this.contact_email;
  }

  get phone(): string {
    return this.contact_phone;
  }

  get business_profile(): BusinessProfile {
    return this.profile_value;
  }

  get business_profile_label(): string {
    return business_profile_labels[this.profile_value];
  }

  get department(): string {
    return this.department_value;
  }

  get city(): string {
    return this.city_value;
  }

  get advisor_id(): string | null {
    return this.advisor_identifier;
  }

  get product_sku(): string | null {
    return this.product_identifier;
  }

  get intent(): LeadIntent {
    return this.intent_value;
  }

  get intent_label(): string {
    return lead_intent_labels[this.intent_value];
  }

  get source_channel(): LeadSourceChannel {
    return this.source_value;
  }

  get source_channel_label(): string {
    return lead_source_channel_labels[this.source_value];
  }

  get estimated_monthly_volume(): number {
    return this.monthly_volume;
  }

  get status(): LeadStatus {
    return this.current_status;
  }

  get status_label(): string {
    return lead_status_labels[this.current_status];
  }

  get created_at(): string {
    return this.created_timestamp;
  }

  get notes(): readonly string[] {
    return [...this.lead_notes];
  }

  change_status(new_status: LeadStatus): void {
    const validated_status = DomainGuard.require_enum_value(new_status, lead_statuses, "status");
    if (this.current_status === "closed" && validated_status !== "closed") {
      throw new DomainValidationException("status", "a closed lead cannot return to an active status", new_status);
    }
    this.current_status = validated_status;
  }

  add_note(new_note: string): void {
    const validated_note = DomainGuard.require_non_empty_string(new_note, "note");
    this.lead_notes = [...this.lead_notes, validated_note];
  }

  to_plain_record(): B2BLeadRecord {
    return {
      lead_id: this.lead_identifier,
      company_name: this.company_value,
      contact_name: this.contact_name_value,
      email: this.contact_email,
      phone: this.contact_phone,
      business_profile: this.profile_value,
      business_profile_label: this.business_profile_label,
      department: this.department_value,
      city: this.city_value,
      advisor_id: this.advisor_identifier,
      product_sku: this.product_identifier,
      intent: this.intent_value,
      intent_label: this.intent_label,
      source_channel: this.source_value,
      source_channel_label: this.source_channel_label,
      estimated_monthly_volume: this.monthly_volume,
      status: this.current_status,
      status_label: this.status_label,
      created_at: this.created_timestamp,
      notes: [...this.lead_notes],
    };
  }
}
