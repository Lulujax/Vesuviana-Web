import {
  BrandCode,
  brand_codes,
  brand_labels,
  ColombianRegion,
  colombian_region_labels,
  colombian_regions,
} from "../domain/product_classification";
import { DomainValidationException } from "../exceptions/domain_validation_exception";
import { DomainGuard } from "../validation/domain_guard";
import { build_initials } from "../utils/text_formatters";

export interface RegionalAdvisorSeed {
  advisor_id: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp_phone: string;
  region: ColombianRegion;
  department: string;
  city: string;
  coverage_departments: readonly string[];
  brand_codes: readonly BrandCode[];
  years_of_experience: number;
  monthly_wholesale_capacity: number;
  availability_label: string;
  bio: string;
  is_active?: boolean;
}

export interface RegionalAdvisorRecord {
  advisor_id: string;
  full_name: string;
  initials: string;
  email: string;
  phone: string;
  whatsapp_phone: string;
  region: ColombianRegion;
  region_name: string;
  department: string;
  city: string;
  coverage_departments: string[];
  coverage_label: string;
  brand_codes: BrandCode[];
  brand_names: string[];
  years_of_experience: number;
  monthly_wholesale_capacity: number;
  availability_label: string;
  bio: string;
  is_active: boolean;
}

export class RegionalAdvisor {
  private readonly advisor_identifier: string;
  private readonly advisor_name: string;
  private advisor_email: string;
  private advisor_phone: string;
  private advisor_whatsapp: string;
  private readonly region_value: ColombianRegion;
  private readonly department_value: string;
  private readonly city_value: string;
  private readonly coverage_values: readonly string[];
  private readonly supported_brands: readonly BrandCode[];
  private readonly experience_years: number;
  private readonly monthly_capacity: number;
  private readonly availability_copy: string;
  private readonly biography: string;
  private readonly active_value: boolean;

  constructor(seed_data: RegionalAdvisorSeed) {
    this.advisor_identifier = DomainGuard.require_non_empty_string(seed_data.advisor_id, "advisor_id");
    this.advisor_name = DomainGuard.require_non_empty_string(seed_data.full_name, "full_name");
    this.advisor_email = DomainGuard.require_email(seed_data.email, "email");
    this.advisor_phone = DomainGuard.require_phone(seed_data.phone, "phone");
    this.advisor_whatsapp = DomainGuard.require_phone(seed_data.whatsapp_phone, "whatsapp_phone");
    this.region_value = DomainGuard.require_enum_value(seed_data.region, colombian_regions, "region");
    this.department_value = DomainGuard.require_non_empty_string(seed_data.department, "department");
    this.city_value = DomainGuard.require_non_empty_string(seed_data.city, "city");
    this.coverage_values = DomainGuard.require_non_empty_string_collection(
      seed_data.coverage_departments,
      "coverage_departments",
    );
    this.supported_brands = DomainGuard.require_enum_collection(seed_data.brand_codes, brand_codes, "brand_codes");
    this.experience_years = DomainGuard.require_number_in_range(
      seed_data.years_of_experience,
      "years_of_experience",
      0,
      60,
    );
    this.monthly_capacity = DomainGuard.require_positive_integer(
      seed_data.monthly_wholesale_capacity,
      "monthly_wholesale_capacity",
    );
    this.availability_copy = DomainGuard.require_non_empty_string(
      seed_data.availability_label,
      "availability_label",
    );
    this.biography = DomainGuard.require_non_empty_string(seed_data.bio, "bio");
    this.active_value = DomainGuard.require_boolean(seed_data.is_active ?? true, "is_active");
    if (!this.coverage_values.includes(this.department_value)) {
      throw new DomainValidationException(
        "coverage_departments",
        "coverage_departments must include the advisor base department",
        this.coverage_values,
      );
    }
  }

  get advisor_id(): string {
    return this.advisor_identifier;
  }

  get full_name(): string {
    return this.advisor_name;
  }

  get initials(): string {
    return build_initials(this.advisor_name);
  }

  get email(): string {
    return this.advisor_email;
  }

  get phone(): string {
    return this.advisor_phone;
  }

  get whatsapp_phone(): string {
    return this.advisor_whatsapp;
  }

  get region(): ColombianRegion {
    return this.region_value;
  }

  get region_name(): string {
    return colombian_region_labels[this.region_value];
  }

  get department(): string {
    return this.department_value;
  }

  get city(): string {
    return this.city_value;
  }

  get coverage_departments(): readonly string[] {
    return [...this.coverage_values];
  }

  get coverage_label(): string {
    return this.coverage_values.join(" · ");
  }

  get brand_codes(): readonly BrandCode[] {
    return [...this.supported_brands];
  }

  get brand_names(): string[] {
    return this.supported_brands.map((brand_code) => brand_labels[brand_code]);
  }

  get years_of_experience(): number {
    return this.experience_years;
  }

  get monthly_wholesale_capacity(): number {
    return this.monthly_capacity;
  }

  get availability_label(): string {
    return this.availability_copy;
  }

  get bio(): string {
    return this.biography;
  }

  get is_active(): boolean {
    return this.active_value;
  }

  covers_department(department_name: string): boolean {
    const normalized_department = department_name.trim().toLowerCase();
    return this.coverage_values.some(
      (covered_department) => covered_department.toLowerCase() === normalized_department,
    );
  }

  supports_brand(brand_code: BrandCode): boolean {
    return this.supported_brands.includes(brand_code);
  }

  update_contact_channels(new_email: string, new_phone: string, new_whatsapp_phone: string): void {
    this.advisor_email = DomainGuard.require_email(new_email, "email");
    this.advisor_phone = DomainGuard.require_phone(new_phone, "phone");
    this.advisor_whatsapp = DomainGuard.require_phone(new_whatsapp_phone, "whatsapp_phone");
  }

  to_plain_record(): RegionalAdvisorRecord {
    return {
      advisor_id: this.advisor_identifier,
      full_name: this.advisor_name,
      initials: this.initials,
      email: this.advisor_email,
      phone: this.advisor_phone,
      whatsapp_phone: this.advisor_whatsapp,
      region: this.region_value,
      region_name: this.region_name,
      department: this.department_value,
      city: this.city_value,
      coverage_departments: [...this.coverage_values],
      coverage_label: this.coverage_label,
      brand_codes: [...this.supported_brands],
      brand_names: this.brand_names,
      years_of_experience: this.experience_years,
      monthly_wholesale_capacity: this.monthly_capacity,
      availability_label: this.availability_copy,
      bio: this.biography,
      is_active: this.active_value,
    };
  }
}
