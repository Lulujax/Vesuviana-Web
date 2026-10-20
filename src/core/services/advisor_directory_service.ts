import { CustomLinkedList } from "../data_structures/custom_linked_list";
import {
  BrandCode,
  brand_labels,
  ColombianRegion,
  colombian_region_labels,
  colombian_regions,
} from "../domain/product_classification";
import { RegionalAdvisor, RegionalAdvisorRecord } from "../entities/regional_advisor";
import { DuplicateResourceException } from "../exceptions/duplicate_resource_exception";
import { ResourceNotFoundException } from "../exceptions/resource_not_found_exception";
import { normalize_text_for_search } from "../utils/text_formatters";

export interface AdvisorSearchCriteria {
  region?: ColombianRegion;
  department?: string;
  brand_code?: BrandCode;
  search_term?: string;
}

export interface AdvisorRegionFacet {
  region: ColombianRegion;
  label: string;
  count: number;
}

export class AdvisorDirectoryService {
  private readonly advisors: CustomLinkedList<RegionalAdvisor>;

  constructor(initial_advisors: readonly RegionalAdvisor[] = []) {
    this.advisors = new CustomLinkedList<RegionalAdvisor>();
    initial_advisors.forEach((advisor) => this.add_advisor(advisor));
  }

  get size(): number {
    return this.advisors.size;
  }

  add_advisor(advisor: RegionalAdvisor): void {
    if (this.advisors.contains((current_advisor) => current_advisor.advisor_id === advisor.advisor_id)) {
      throw new DuplicateResourceException("RegionalAdvisor", advisor.advisor_id);
    }
    this.advisors.append(advisor);
  }

  remove_advisor(advisor_id: string): RegionalAdvisor {
    const removed_advisor = this.advisors.remove_first(
      (advisor) => advisor.advisor_id === advisor_id,
    );
    if (removed_advisor === undefined) {
      throw new ResourceNotFoundException("RegionalAdvisor", advisor_id);
    }
    return removed_advisor;
  }

  get_by_id(advisor_id: string): RegionalAdvisor {
    const found_advisor = this.advisors.find((advisor) => advisor.advisor_id === advisor_id);
    if (found_advisor === undefined) {
      throw new ResourceNotFoundException("RegionalAdvisor", advisor_id);
    }
    return found_advisor;
  }

  get_all_advisors(): RegionalAdvisor[] {
    return this.advisors.to_array();
  }

  get_active_advisors(): RegionalAdvisor[] {
    return this.advisors.filter((advisor) => advisor.is_active);
  }

  search(criteria: AdvisorSearchCriteria): RegionalAdvisor[] {
    const normalized_term = normalize_text_for_search(criteria.search_term ?? "");
    return this.advisors.filter((advisor) => {
      if (!advisor.is_active) {
        return false;
      }
      const region_matches = criteria.region === undefined || advisor.region === criteria.region;
      const department_matches =
        criteria.department === undefined ||
        criteria.department.length === 0 ||
        advisor.covers_department(criteria.department);
      const brand_matches =
        criteria.brand_code === undefined || advisor.supports_brand(criteria.brand_code);
      const search_matches =
        normalized_term.length === 0 ||
        normalize_text_for_search(
          [
            advisor.full_name,
            advisor.city,
            advisor.department,
            advisor.coverage_departments.join(" "),
            advisor.brand_names.join(" "),
            advisor.bio,
          ].join(" "),
        ).includes(normalized_term);
      return region_matches && department_matches && brand_matches && search_matches;
    });
  }

  find_advisor_for_department(department: string, brand_code?: BrandCode): RegionalAdvisor | undefined {
    return this.advisors.find(
      (advisor) =>
        advisor.is_active &&
        advisor.covers_department(department) &&
        (brand_code === undefined || advisor.supports_brand(brand_code)),
    );
  }

  get_coverage_departments(): string[] {
    const collected_departments: string[] = [];
    this.advisors.for_each((advisor) => {
      advisor.coverage_departments.forEach((department) => {
        if (!collected_departments.includes(department)) {
          collected_departments.push(department);
        }
      });
    });
    return collected_departments.sort((first_department, second_department) =>
      first_department.localeCompare(second_department, "es"),
    );
  }

  get_region_facets(): AdvisorRegionFacet[] {
    const active_advisors = this.get_active_advisors();
    return colombian_regions.map((region) => ({
      region,
      label: colombian_region_labels[region],
      count: active_advisors.filter((advisor) => advisor.region === region).length,
    }));
  }

  get_brand_facets(): { value: BrandCode; label: string; count: number }[] {
    const active_advisors = this.get_active_advisors();
    return (Object.keys(brand_labels) as BrandCode[]).map((brand_code) => ({
      value: brand_code,
      label: brand_labels[brand_code],
      count: active_advisors.filter((advisor) => advisor.supports_brand(brand_code)).length,
    }));
  }

  get_all_records(): RegionalAdvisorRecord[] {
    return this.advisors.map((advisor) => advisor.to_plain_record());
  }

  get_active_records(): RegionalAdvisorRecord[] {
    return this.get_active_advisors().map((advisor) => advisor.to_plain_record());
  }
}
