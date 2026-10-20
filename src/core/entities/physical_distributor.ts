import { BrandCode, brand_codes, brand_labels } from "../domain/product_classification";
import { DomainGuard } from "../validation/domain_guard";

export interface PhysicalDistributorSeed {
  distributor_id: string;
  trade_name: string;
  legal_name: string;
  address_line: string;
  city: string;
  department: string;
  phone: string;
  email: string;
  opening_hours: string;
  latitude: number;
  longitude: number;
  advisor_id: string;
  brand_codes: readonly BrandCode[];
  is_o2o_enabled?: boolean;
  pickup_available?: boolean;
  is_active?: boolean;
}

export interface PhysicalDistributorRecord {
  distributor_id: string;
  trade_name: string;
  legal_name: string;
  address_line: string;
  city: string;
  department: string;
  phone: string;
  email: string;
  opening_hours: string;
  latitude: number;
  longitude: number;
  coordinates_label: string;
  advisor_id: string;
  brand_codes: BrandCode[];
  brand_names: string[];
  is_o2o_enabled: boolean;
  pickup_available: boolean;
  is_active: boolean;
  map_query: string;
}

export class PhysicalDistributor {
  private readonly distributor_identifier: string;
  private readonly commercial_name: string;
  private readonly registered_name: string;
  private readonly address_value: string;
  private readonly city_value: string;
  private readonly department_value: string;
  private contact_phone: string;
  private contact_email: string;
  private readonly schedule_copy: string;
  private readonly latitude_value: number;
  private readonly longitude_value: number;
  private readonly assigned_advisor_identifier: string;
  private readonly represented_brands: readonly BrandCode[];
  private readonly o2o_enabled_value: boolean;
  private readonly pickup_enabled_value: boolean;
  private readonly active_value: boolean;

  constructor(seed_data: PhysicalDistributorSeed) {
    this.distributor_identifier = DomainGuard.require_non_empty_string(
      seed_data.distributor_id,
      "distributor_id",
    );
    this.commercial_name = DomainGuard.require_non_empty_string(seed_data.trade_name, "trade_name");
    this.registered_name = DomainGuard.require_non_empty_string(seed_data.legal_name, "legal_name");
    this.address_value = DomainGuard.require_non_empty_string(seed_data.address_line, "address_line");
    this.city_value = DomainGuard.require_non_empty_string(seed_data.city, "city");
    this.department_value = DomainGuard.require_non_empty_string(seed_data.department, "department");
    this.contact_phone = DomainGuard.require_phone(seed_data.phone, "phone");
    this.contact_email = DomainGuard.require_email(seed_data.email, "email");
    this.schedule_copy = DomainGuard.require_non_empty_string(seed_data.opening_hours, "opening_hours");
    this.latitude_value = DomainGuard.require_latitude(seed_data.latitude, "latitude");
    this.longitude_value = DomainGuard.require_longitude(seed_data.longitude, "longitude");
    this.assigned_advisor_identifier = DomainGuard.require_non_empty_string(seed_data.advisor_id, "advisor_id");
    this.represented_brands = DomainGuard.require_enum_collection(
      seed_data.brand_codes,
      brand_codes,
      "brand_codes",
    );
    this.o2o_enabled_value = DomainGuard.require_boolean(seed_data.is_o2o_enabled ?? true, "is_o2o_enabled");
    this.pickup_enabled_value = DomainGuard.require_boolean(
      seed_data.pickup_available ?? true,
      "pickup_available",
    );
    this.active_value = DomainGuard.require_boolean(seed_data.is_active ?? true, "is_active");
  }

  get distributor_id(): string {
    return this.distributor_identifier;
  }

  get trade_name(): string {
    return this.commercial_name;
  }

  get legal_name(): string {
    return this.registered_name;
  }

  get address_line(): string {
    return this.address_value;
  }

  get city(): string {
    return this.city_value;
  }

  get department(): string {
    return this.department_value;
  }

  get phone(): string {
    return this.contact_phone;
  }

  get email(): string {
    return this.contact_email;
  }

  get opening_hours(): string {
    return this.schedule_copy;
  }

  get latitude(): number {
    return this.latitude_value;
  }

  get longitude(): number {
    return this.longitude_value;
  }

  get coordinates_label(): string {
    return `${this.latitude_value.toFixed(4)}, ${this.longitude_value.toFixed(4)}`;
  }

  get advisor_id(): string {
    return this.assigned_advisor_identifier;
  }

  get brand_codes(): readonly BrandCode[] {
    return [...this.represented_brands];
  }

  get brand_names(): string[] {
    return this.represented_brands.map((brand_code) => brand_labels[brand_code]);
  }

  get is_o2o_enabled(): boolean {
    return this.o2o_enabled_value;
  }

  get pickup_available(): boolean {
    return this.pickup_enabled_value;
  }

  get is_active(): boolean {
    return this.active_value;
  }

  get map_query(): string {
    return `${this.address_value}, ${this.city_value}, ${this.department_value}, Colombia`;
  }

  supports_brand(brand_code: BrandCode): boolean {
    return this.represented_brands.includes(brand_code);
  }

  update_contact_channels(new_phone: string, new_email: string): void {
    this.contact_phone = DomainGuard.require_phone(new_phone, "phone");
    this.contact_email = DomainGuard.require_email(new_email, "email");
  }

  to_plain_record(): PhysicalDistributorRecord {
    return {
      distributor_id: this.distributor_identifier,
      trade_name: this.commercial_name,
      legal_name: this.registered_name,
      address_line: this.address_value,
      city: this.city_value,
      department: this.department_value,
      phone: this.contact_phone,
      email: this.contact_email,
      opening_hours: this.schedule_copy,
      latitude: this.latitude_value,
      longitude: this.longitude_value,
      coordinates_label: this.coordinates_label,
      advisor_id: this.assigned_advisor_identifier,
      brand_codes: [...this.represented_brands],
      brand_names: this.brand_names,
      is_o2o_enabled: this.o2o_enabled_value,
      pickup_available: this.pickup_enabled_value,
      is_active: this.active_value,
      map_query: this.map_query,
    };
  }
}
