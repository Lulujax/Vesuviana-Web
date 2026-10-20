import { AnatomicalLayer, BrandCode, ProductIllustration } from "../domain/product_classification";
import { CosmeticProduct, CosmeticProductRecord, CosmeticProductSeed } from "./cosmetic_product";
import { DomainGuard } from "../validation/domain_guard";

export interface OleosProductSeed extends CosmeticProductSeed {
  thermal_protection_celsius: number;
  frizz_control_hours: number;
  lipid_seal_index: number;
  body_safe: boolean;
}

export class OleosProduct extends CosmeticProduct {
  private readonly thermal_limit_in_celsius: number;
  private readonly frizz_control_duration: number;
  private readonly lipid_seal_value: number;
  private readonly body_use_safe: boolean;

  constructor(seed_data: OleosProductSeed) {
    super(seed_data);
    this.thermal_limit_in_celsius = DomainGuard.require_number_in_range(
      seed_data.thermal_protection_celsius,
      "thermal_protection_celsius",
      0,
      260,
    );
    this.frizz_control_duration = DomainGuard.require_number_in_range(
      seed_data.frizz_control_hours,
      "frizz_control_hours",
      0,
      72,
    );
    this.lipid_seal_value = DomainGuard.require_percentage(seed_data.lipid_seal_index, "lipid_seal_index");
    this.body_use_safe = DomainGuard.require_boolean(seed_data.body_safe, "body_safe");
  }

  get brand_code(): BrandCode {
    return "oleos";
  }

  get anatomical_layer(): AnatomicalLayer {
    return "exterior_shield";
  }

  get illustration_kind(): ProductIllustration {
    if (this.product_format === "serum") {
      return "dropper_bottle";
    }
    return "oil_flask";
  }

  get brand_action_statement(): string {
    return "Sellado lipídico exterior que controla el frizz, aporta brillo y protege la fibra del calor.";
  }

  get requires_professional_application(): boolean {
    return this.commercial_level === "professional";
  }

  get thermal_protection_celsius(): number {
    return this.thermal_limit_in_celsius;
  }

  get frizz_control_hours(): number {
    return this.frizz_control_duration;
  }

  get lipid_seal_index(): number {
    return this.lipid_seal_value;
  }

  get body_safe(): boolean {
    return this.body_use_safe;
  }

  override to_plain_record(): CosmeticProductRecord {
    return {
      ...super.to_plain_record(),
      technical_details: {
        thermal_protection_celsius: this.thermal_limit_in_celsius,
        frizz_control_hours: this.frizz_control_duration,
        lipid_seal_index: this.lipid_seal_value,
        body_safe: this.body_use_safe,
      },
    };
  }
}
