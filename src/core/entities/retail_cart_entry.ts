import { BrandCode, brand_codes, brand_labels } from "../domain/product_classification";
import { DomainGuard } from "../validation/domain_guard";

export interface RetailCartEntrySeed {
  entry_id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  brand_code: BrandCode;
  unit_price_in_cop: number;
  quantity?: number;
}

export interface RetailCartEntryRecord {
  entry_id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  brand_code: BrandCode;
  brand_name: string;
  unit_price_in_cop: number;
  quantity: number;
  line_total_in_cop: number;
}

export class RetailCartEntry {
  private readonly entry_identifier: string;
  private readonly product_identifier: string;
  private readonly stock_keeping_unit: string;
  private readonly product_display_name: string;
  private readonly brand_value: BrandCode;
  private readonly unit_price_value: number;
  private quantity_value: number;

  constructor(seed_data: RetailCartEntrySeed) {
    this.entry_identifier = DomainGuard.require_non_empty_string(seed_data.entry_id, "entry_id");
    this.product_identifier = DomainGuard.require_non_empty_string(seed_data.product_id, "product_id");
    this.stock_keeping_unit = DomainGuard.require_non_empty_string(seed_data.product_sku, "product_sku");
    this.product_display_name = DomainGuard.require_non_empty_string(seed_data.product_name, "product_name");
    this.brand_value = DomainGuard.require_enum_value(seed_data.brand_code, brand_codes, "brand_code");
    this.unit_price_value = DomainGuard.require_positive_integer(
      seed_data.unit_price_in_cop,
      "unit_price_in_cop",
    );
    this.quantity_value = DomainGuard.require_positive_integer(seed_data.quantity ?? 1, "quantity");
  }

  get entry_id(): string {
    return this.entry_identifier;
  }

  get product_id(): string {
    return this.product_identifier;
  }

  get product_sku(): string {
    return this.stock_keeping_unit;
  }

  get product_name(): string {
    return this.product_display_name;
  }

  get brand_code(): BrandCode {
    return this.brand_value;
  }

  get brand_name(): string {
    return brand_labels[this.brand_value];
  }

  get unit_price_in_cop(): number {
    return this.unit_price_value;
  }

  get quantity(): number {
    return this.quantity_value;
  }

  get line_total_in_cop(): number {
    return this.unit_price_value * this.quantity_value;
  }

  increment_quantity(additional_units: number): void {
    const validated_units = DomainGuard.require_positive_integer(additional_units, "additional_units");
    this.quantity_value += validated_units;
  }

  update_quantity(new_quantity: number): void {
    this.quantity_value = DomainGuard.require_positive_integer(new_quantity, "quantity");
  }

  to_plain_record(): RetailCartEntryRecord {
    return {
      entry_id: this.entry_identifier,
      product_id: this.product_identifier,
      product_sku: this.stock_keeping_unit,
      product_name: this.product_display_name,
      brand_code: this.brand_value,
      brand_name: this.brand_name,
      unit_price_in_cop: this.unit_price_value,
      quantity: this.quantity_value,
      line_total_in_cop: this.line_total_in_cop,
    };
  }
}
