import {
  BrandCode,
  CommercialLevel,
  ProductFormat,
  ProductPurpose,
  brand_codes,
  brand_labels,
  commercial_level_labels,
  commercial_levels,
  product_format_labels,
  product_formats,
  product_purpose_labels,
  product_purposes,
} from "../domain/product_classification";
import { DomainValidationException } from "../exceptions/domain_validation_exception";
import { DomainGuard } from "../validation/domain_guard";

export interface CatalogFilterState {
  search_term: string;
  brand_codes: readonly BrandCode[];
  product_formats: readonly ProductFormat[];
  purpose_tags: readonly ProductPurpose[];
  commercial_levels: readonly CommercialLevel[];
}

export interface CatalogFilterSnapshotSeed extends CatalogFilterState {
  snapshot_id: string;
  created_at: string;
}

export interface CatalogFilterSnapshotRecord {
  snapshot_id: string;
  search_term: string;
  brand_codes: BrandCode[];
  brand_names: string[];
  product_formats: ProductFormat[];
  product_format_names: string[];
  purpose_tags: ProductPurpose[];
  purpose_labels: string[];
  commercial_levels: CommercialLevel[];
  commercial_level_names: string[];
  created_at: string;
  active_filter_count: number;
  filter_signature: string;
}

export class CatalogFilterSnapshot {
  private readonly snapshot_identifier: string;
  private readonly search_value: string;
  private readonly brand_values: readonly BrandCode[];
  private readonly format_values: readonly ProductFormat[];
  private readonly purpose_values: readonly ProductPurpose[];
  private readonly level_values: readonly CommercialLevel[];
  private readonly created_timestamp: string;

  constructor(seed_data: CatalogFilterSnapshotSeed) {
    this.snapshot_identifier = DomainGuard.require_non_empty_string(seed_data.snapshot_id, "snapshot_id");
    if (typeof seed_data.search_term !== "string") {
      throw new DomainValidationException("search_term", "search_term must be a string", seed_data.search_term);
    }
    this.search_value = seed_data.search_term.trim();
    this.brand_values = DomainGuard.require_optional_enum_collection(
      seed_data.brand_codes,
      brand_codes,
      "brand_codes",
    );
    this.format_values = DomainGuard.require_optional_enum_collection(
      seed_data.product_formats,
      product_formats,
      "product_formats",
    );
    this.purpose_values = DomainGuard.require_optional_enum_collection(
      seed_data.purpose_tags,
      product_purposes,
      "purpose_tags",
    );
    this.level_values = DomainGuard.require_optional_enum_collection(
      seed_data.commercial_levels,
      commercial_levels,
      "commercial_levels",
    );
    this.created_timestamp = DomainGuard.require_iso_timestamp(seed_data.created_at, "created_at");
  }

  get snapshot_id(): string {
    return this.snapshot_identifier;
  }

  get search_term(): string {
    return this.search_value;
  }

  get brand_codes(): readonly BrandCode[] {
    return [...this.brand_values];
  }

  get product_formats(): readonly ProductFormat[] {
    return [...this.format_values];
  }

  get purpose_tags(): readonly ProductPurpose[] {
    return [...this.purpose_values];
  }

  get commercial_levels(): readonly CommercialLevel[] {
    return [...this.level_values];
  }

  get created_at(): string {
    return this.created_timestamp;
  }

  get active_filter_count(): number {
    return (
      this.brand_values.length +
      this.format_values.length +
      this.purpose_values.length +
      this.level_values.length +
      (this.search_value.length > 0 ? 1 : 0)
    );
  }

  get filter_signature(): string {
    return [
      this.search_value,
      [...this.brand_values].sort().join(","),
      [...this.format_values].sort().join(","),
      [...this.purpose_values].sort().join(","),
      [...this.level_values].sort().join(","),
    ].join("|");
  }

  to_filter_state(): CatalogFilterState {
    return {
      search_term: this.search_value,
      brand_codes: [...this.brand_values],
      product_formats: [...this.format_values],
      purpose_tags: [...this.purpose_values],
      commercial_levels: [...this.level_values],
    };
  }

  to_plain_record(): CatalogFilterSnapshotRecord {
    return {
      snapshot_id: this.snapshot_identifier,
      search_term: this.search_value,
      brand_codes: [...this.brand_values],
      brand_names: this.brand_values.map((brand_code) => brand_labels[brand_code]),
      product_formats: [...this.format_values],
      product_format_names: this.format_values.map((format) => product_format_labels[format]),
      purpose_tags: [...this.purpose_values],
      purpose_labels: this.purpose_values.map((purpose) => product_purpose_labels[purpose]),
      commercial_levels: [...this.level_values],
      commercial_level_names: this.level_values.map((level) => commercial_level_labels[level]),
      created_at: this.created_timestamp,
      active_filter_count: this.active_filter_count,
      filter_signature: this.filter_signature,
    };
  }
}
