import { AnatomicalLayer, BrandCode, ProductIllustration } from "../domain/product_classification";
import { CosmeticProduct, CosmeticProductRecord, CosmeticProductSeed } from "./cosmetic_product";
import { DomainGuard } from "../validation/domain_guard";

export interface TricomplexProductSeed extends CosmeticProductSeed {
  active_concentration_percentage: number;
  shock_protocol_days: number;
  structural_repair_index: number;
  professional_only: boolean;
  treatment_phase: string;
}

export class TricomplexProduct extends CosmeticProduct {
  private readonly concentration_percentage: number;
  private readonly protocol_duration_in_days: number;
  private readonly repair_index_value: number;
  private readonly professional_restriction: boolean;
  private readonly clinical_phase: string;

  constructor(seed_data: TricomplexProductSeed) {
    super(seed_data);
    this.concentration_percentage = DomainGuard.require_percentage(
      seed_data.active_concentration_percentage,
      "active_concentration_percentage",
    );
    this.protocol_duration_in_days = DomainGuard.require_number_in_range(
      seed_data.shock_protocol_days,
      "shock_protocol_days",
      1,
      120,
    );
    this.repair_index_value = DomainGuard.require_percentage(
      seed_data.structural_repair_index,
      "structural_repair_index",
    );
    this.professional_restriction = DomainGuard.require_boolean(
      seed_data.professional_only,
      "professional_only",
    );
    this.clinical_phase = DomainGuard.require_non_empty_string(seed_data.treatment_phase, "treatment_phase");
  }

  get brand_code(): BrandCode {
    return "tricomplex";
  }

  get anatomical_layer(): AnatomicalLayer {
    return "cortex";
  }

  get illustration_kind(): ProductIllustration {
    if (this.product_format === "ampoule") {
      return "technical_ampoule";
    }
    if (this.product_format === "serum") {
      return "dropper_bottle";
    }
    return "molecular_structure";
  }

  get brand_action_statement(): string {
    return "Terapia de choque de alta concentración para reconstruir la corteza y recuperar elasticidad.";
  }

  get requires_professional_application(): boolean {
    return this.professional_restriction || this.commercial_level === "professional";
  }

  get active_concentration_percentage(): number {
    return this.concentration_percentage;
  }

  get shock_protocol_days(): number {
    return this.protocol_duration_in_days;
  }

  get structural_repair_index(): number {
    return this.repair_index_value;
  }

  get professional_only(): boolean {
    return this.professional_restriction;
  }

  get treatment_phase(): string {
    return this.clinical_phase;
  }

  override to_plain_record(): CosmeticProductRecord {
    return {
      ...super.to_plain_record(),
      technical_details: {
        active_concentration_percentage: this.concentration_percentage,
        shock_protocol_days: this.protocol_duration_in_days,
        structural_repair_index: this.repair_index_value,
        professional_only: this.professional_restriction,
        treatment_phase: this.clinical_phase,
      },
    };
  }
}
