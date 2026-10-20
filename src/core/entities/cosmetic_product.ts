import {
  AnatomicalLayer,
  brand_labels,
  BrandCode,
  commercial_level_labels,
  CommercialLevel,
  ProductFormat,
  product_format_labels,
  ProductIllustration,
  ProductPurpose,
  product_purpose_labels,
  product_purposes,
  commercial_levels,
  product_formats,
} from "../domain/product_classification";
import { DomainValidationException } from "../exceptions/domain_validation_exception";
import { build_slug, format_cop_amount } from "../utils/text_formatters";
import { DomainGuard } from "../validation/domain_guard";

export interface CosmeticProductSeed {
  product_id: string;
  product_sku: string;
  product_name: string;
  product_format: ProductFormat;
  commercial_level: CommercialLevel;
  purpose_tags: readonly ProductPurpose[];
  active_complexes: readonly string[];
  technical_description: string;
  size_in_milliliters: number;
  retail_price_in_cop: number;
  wholesale_case_units: number;
  wholesale_unit_price_in_cop: number;
  is_featured?: boolean;
  botanical_origin: string;
  usage_ritual: string;
  contraindications?: readonly string[];
}

export interface CosmeticProductRecord {
  product_id: string;
  product_sku: string;
  product_name: string;
  product_slug: string;
  brand_code: BrandCode;
  brand_name: string;
  commercial_level: CommercialLevel;
  commercial_level_name: string;
  product_format: ProductFormat;
  product_format_name: string;
  purpose_tags: ProductPurpose[];
  purpose_labels: string[];
  active_complexes: string[];
  active_complexes_label: string;
  technical_description: string;
  size_in_milliliters: number;
  retail_price_in_cop: number;
  retail_price_label: string;
  wholesale_case_units: number;
  wholesale_unit_price_in_cop: number;
  wholesale_unit_price_label: string;
  wholesale_margin_percentage: number;
  is_featured: boolean;
  botanical_origin: string;
  usage_ritual: string;
  contraindications: string[];
  anatomical_layer: AnatomicalLayer;
  illustration_kind: ProductIllustration;
  brand_action_statement: string;
  requires_professional_application: boolean;
  technical_details: Record<string, string | number | boolean>;
}

export abstract class CosmeticProduct {
  private readonly product_identifier: string;
  private readonly stock_keeping_unit: string;
  private product_display_name: string;
  private readonly format_value: ProductFormat;
  private readonly level_value: CommercialLevel;
  private readonly purpose_values: readonly ProductPurpose[];
  private readonly active_complex_values: readonly string[];
  private technical_copy: string;
  private readonly volume_in_milliliters: number;
  private retail_price_value: number;
  private readonly wholesale_units_per_case: number;
  private readonly wholesale_price_value: number;
  private readonly featured_value: boolean;
  private readonly botanical_origin_value: string;
  private readonly ritual_instruction: string;
  private readonly contraindication_values: readonly string[];

  protected constructor(seed_data: CosmeticProductSeed) {
    this.product_identifier = DomainGuard.require_non_empty_string(seed_data.product_id, "product_id");
    this.stock_keeping_unit = DomainGuard.require_non_empty_string(seed_data.product_sku, "product_sku");
    this.product_display_name = DomainGuard.require_non_empty_string(seed_data.product_name, "product_name");
    this.format_value = DomainGuard.require_enum_value(seed_data.product_format, product_formats, "product_format");
    this.level_value = DomainGuard.require_enum_value(
      seed_data.commercial_level,
      commercial_levels,
      "commercial_level",
    );
    this.purpose_values = DomainGuard.require_enum_collection(
      seed_data.purpose_tags,
      product_purposes,
      "purpose_tags",
    );
    this.active_complex_values = DomainGuard.require_non_empty_string_collection(
      seed_data.active_complexes,
      "active_complexes",
    );
    this.technical_copy = DomainGuard.require_non_empty_string(
      seed_data.technical_description,
      "technical_description",
    );
    this.volume_in_milliliters = DomainGuard.require_positive_integer(
      seed_data.size_in_milliliters,
      "size_in_milliliters",
    );
    this.retail_price_value = DomainGuard.require_positive_integer(
      seed_data.retail_price_in_cop,
      "retail_price_in_cop",
    );
    this.wholesale_units_per_case = DomainGuard.require_positive_integer(
      seed_data.wholesale_case_units,
      "wholesale_case_units",
    );
    this.wholesale_price_value = DomainGuard.require_positive_integer(
      seed_data.wholesale_unit_price_in_cop,
      "wholesale_unit_price_in_cop",
    );
    this.featured_value = DomainGuard.require_boolean(seed_data.is_featured ?? false, "is_featured");
    this.botanical_origin_value = DomainGuard.require_non_empty_string(
      seed_data.botanical_origin,
      "botanical_origin",
    );
    this.ritual_instruction = DomainGuard.require_non_empty_string(seed_data.usage_ritual, "usage_ritual");
    this.contraindication_values =
      seed_data.contraindications === undefined
        ? ["Uso externo. Evitar contacto con ojos y mucosas."]
        : DomainGuard.require_non_empty_string_collection(seed_data.contraindications, "contraindications");
    this.validate_wholesale_pricing();
  }

  abstract get brand_code(): BrandCode;

  abstract get anatomical_layer(): AnatomicalLayer;

  abstract get illustration_kind(): ProductIllustration;

  abstract get brand_action_statement(): string;

  get product_id(): string {
    return this.product_identifier;
  }

  get product_sku(): string {
    return this.stock_keeping_unit;
  }

  get product_name(): string {
    return this.product_display_name;
  }

  set product_name(new_name: string) {
    this.product_display_name = DomainGuard.require_non_empty_string(new_name, "product_name");
  }

  get product_slug(): string {
    return build_slug(this.product_display_name);
  }

  get brand_name(): string {
    return brand_labels[this.brand_code];
  }

  get commercial_level(): CommercialLevel {
    return this.level_value;
  }

  get commercial_level_name(): string {
    return commercial_level_labels[this.level_value];
  }

  get product_format(): ProductFormat {
    return this.format_value;
  }

  get product_format_name(): string {
    return product_format_labels[this.format_value];
  }

  get purpose_tags(): readonly ProductPurpose[] {
    return [...this.purpose_values];
  }

  get purpose_labels(): string[] {
    return this.purpose_values.map((purpose) => product_purpose_labels[purpose]);
  }

  get active_complexes(): readonly string[] {
    return [...this.active_complex_values];
  }

  get active_complexes_label(): string {
    return this.active_complex_values.join(" · ");
  }

  get technical_description(): string {
    return this.technical_copy;
  }

  set technical_description(new_description: string) {
    this.technical_copy = DomainGuard.require_non_empty_string(new_description, "technical_description");
  }

  get size_in_milliliters(): number {
    return this.volume_in_milliliters;
  }

  get retail_price_in_cop(): number {
    return this.retail_price_value;
  }

  set retail_price_in_cop(new_price: number) {
    const validated_price = DomainGuard.require_positive_integer(new_price, "retail_price_in_cop");
    if (validated_price <= this.wholesale_price_value) {
      throw new DomainValidationException(
        "retail_price_in_cop",
        "retail_price_in_cop must remain above wholesale_unit_price_in_cop",
        new_price,
      );
    }
    this.retail_price_value = validated_price;
  }

  get retail_price_label(): string {
    return format_cop_amount(this.retail_price_value);
  }

  get wholesale_case_units(): number {
    return this.wholesale_units_per_case;
  }

  get wholesale_unit_price_in_cop(): number {
    return this.wholesale_price_value;
  }

  get wholesale_unit_price_label(): string {
    return format_cop_amount(this.wholesale_price_value);
  }

  get wholesale_margin_percentage(): number {
    const margin = ((this.retail_price_value - this.wholesale_price_value) / this.retail_price_value) * 100;
    return Number(margin.toFixed(1));
  }

  get is_featured(): boolean {
    return this.featured_value;
  }

  get botanical_origin(): string {
    return this.botanical_origin_value;
  }

  get usage_ritual(): string {
    return this.ritual_instruction;
  }

  get contraindications(): readonly string[] {
    return [...this.contraindication_values];
  }

  get specimen_code(): string {
    return this.stock_keeping_unit;
  }

  get requires_professional_application(): boolean {
    return false;
  }

  get category_path(): string[] {
    return [this.brand_name, this.commercial_level_name, this.product_format_name];
  }

  to_plain_record(): CosmeticProductRecord {
    return {
      product_id: this.product_identifier,
      product_sku: this.stock_keeping_unit,
      product_name: this.product_display_name,
      product_slug: this.product_slug,
      brand_code: this.brand_code,
      brand_name: this.brand_name,
      commercial_level: this.level_value,
      commercial_level_name: this.commercial_level_name,
      product_format: this.format_value,
      product_format_name: this.product_format_name,
      purpose_tags: [...this.purpose_values],
      purpose_labels: this.purpose_labels,
      active_complexes: [...this.active_complex_values],
      active_complexes_label: this.active_complexes_label,
      technical_description: this.technical_copy,
      size_in_milliliters: this.volume_in_milliliters,
      retail_price_in_cop: this.retail_price_value,
      retail_price_label: this.retail_price_label,
      wholesale_case_units: this.wholesale_units_per_case,
      wholesale_unit_price_in_cop: this.wholesale_price_value,
      wholesale_unit_price_label: this.wholesale_unit_price_label,
      wholesale_margin_percentage: this.wholesale_margin_percentage,
      is_featured: this.featured_value,
      botanical_origin: this.botanical_origin_value,
      usage_ritual: this.ritual_instruction,
      contraindications: [...this.contraindication_values],
      anatomical_layer: this.anatomical_layer,
      illustration_kind: this.illustration_kind,
      brand_action_statement: this.brand_action_statement,
      requires_professional_application: this.requires_professional_application,
      technical_details: {},
    };
  }

  private validate_wholesale_pricing(): void {
    if (this.wholesale_price_value >= this.retail_price_value) {
      throw new DomainValidationException(
        "wholesale_unit_price_in_cop",
        "wholesale_unit_price_in_cop must be lower than retail_price_in_cop",
        this.wholesale_price_value,
      );
    }
  }
}
