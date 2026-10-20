import { AnatomicalLayer, BrandCode, ProductIllustration } from "../domain/product_classification";
import { CosmeticProduct, CosmeticProductRecord, CosmeticProductSeed } from "./cosmetic_product";
import { DomainGuard } from "../validation/domain_guard";

export interface DefileProductSeed extends CosmeticProductSeed {
  routine_frequency_per_week: number;
  scalp_sensitivity_safe: boolean;
  sulfate_free: boolean;
  color_safe: boolean;
  ph_level: number;
}

export class DefileProduct extends CosmeticProduct {
  private weekly_frequency: number;
  private readonly sensitivity_compatible: boolean;
  private readonly sulfate_free_formula: boolean;
  private readonly color_treated_compatible: boolean;
  private readonly ph_value: number;

  constructor(seed_data: DefileProductSeed) {
    super(seed_data);
    this.weekly_frequency = DomainGuard.require_number_in_range(
      seed_data.routine_frequency_per_week,
      "routine_frequency_per_week",
      1,
      7,
    );
    this.sensitivity_compatible = DomainGuard.require_boolean(
      seed_data.scalp_sensitivity_safe,
      "scalp_sensitivity_safe",
    );
    this.sulfate_free_formula = DomainGuard.require_boolean(seed_data.sulfate_free, "sulfate_free");
    this.color_treated_compatible = DomainGuard.require_boolean(seed_data.color_safe, "color_safe");
    this.ph_value = DomainGuard.require_number_in_range(seed_data.ph_level, "ph_level", 3, 8);
  }

  get brand_code(): BrandCode {
    return "defile";
  }

  get anatomical_layer(): AnatomicalLayer {
    return "cuticle_scalp";
  }

  get illustration_kind(): ProductIllustration {
    if (this.product_format === "ampoule") {
      return "technical_ampoule";
    }
    if (this.product_format === "mask" || this.product_format === "cream_bath") {
      return "mask_jar";
    }
    if (this.product_format === "serum") {
      return "dropper_bottle";
    }
    if (this.product_format === "oil" || this.product_format === "body_fluid") {
      return "oil_flask";
    }
    return "shampoo_bottle";
  }

  get brand_action_statement(): string {
    return "Mantenimiento diario que limpia, hidrata y preserva la cutícula sin comprometer la fibra.";
  }

  get requires_professional_application(): boolean {
    return this.commercial_level === "professional";
  }

  get routine_frequency_per_week(): number {
    return this.weekly_frequency;
  }

  get scalp_sensitivity_safe(): boolean {
    return this.sensitivity_compatible;
  }

  get sulfate_free(): boolean {
    return this.sulfate_free_formula;
  }

  get color_safe(): boolean {
    return this.color_treated_compatible;
  }

  get ph_level(): number {
    return this.ph_value;
  }

  update_routine_frequency(new_frequency: number): void {
    this.weekly_frequency = DomainGuard.require_number_in_range(
      new_frequency,
      "routine_frequency_per_week",
      1,
      7,
    );
  }

  override to_plain_record(): CosmeticProductRecord {
    return {
      ...super.to_plain_record(),
      technical_details: {
        routine_frequency_per_week: this.weekly_frequency,
        scalp_sensitivity_safe: this.sensitivity_compatible,
        sulfate_free: this.sulfate_free_formula,
        color_safe: this.color_treated_compatible,
        ph_level: this.ph_value,
      },
    };
  }
}
