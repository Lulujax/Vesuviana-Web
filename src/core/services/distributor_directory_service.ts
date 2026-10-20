import { CustomLinkedList } from "../data_structures/custom_linked_list";
import { BrandCode } from "../domain/product_classification";
import { PhysicalDistributor, PhysicalDistributorRecord } from "../entities/physical_distributor";
import { DuplicateResourceException } from "../exceptions/duplicate_resource_exception";
import { ResourceNotFoundException } from "../exceptions/resource_not_found_exception";
import { normalize_text_for_search } from "../utils/text_formatters";

export interface DistributorSearchCriteria {
  department?: string;
  brand_code?: BrandCode;
  search_term?: string;
  o2o_only?: boolean;
}

export interface DepartmentFacet {
  department: string;
  count: number;
}

export class DistributorDirectoryService {
  private readonly distributors: CustomLinkedList<PhysicalDistributor>;

  constructor(initial_distributors: readonly PhysicalDistributor[] = []) {
    this.distributors = new CustomLinkedList<PhysicalDistributor>();
    initial_distributors.forEach((distributor) => this.add_distributor(distributor));
  }

  get size(): number {
    return this.distributors.size;
  }

  add_distributor(distributor: PhysicalDistributor): void {
    if (
      this.distributors.contains(
        (current_distributor) => current_distributor.distributor_id === distributor.distributor_id,
      )
    ) {
      throw new DuplicateResourceException("PhysicalDistributor", distributor.distributor_id);
    }
    this.distributors.append(distributor);
  }

  remove_distributor(distributor_id: string): PhysicalDistributor {
    const removed_distributor = this.distributors.remove_first(
      (distributor) => distributor.distributor_id === distributor_id,
    );
    if (removed_distributor === undefined) {
      throw new ResourceNotFoundException("PhysicalDistributor", distributor_id);
    }
    return removed_distributor;
  }

  get_by_id(distributor_id: string): PhysicalDistributor {
    const found_distributor = this.distributors.find(
      (distributor) => distributor.distributor_id === distributor_id,
    );
    if (found_distributor === undefined) {
      throw new ResourceNotFoundException("PhysicalDistributor", distributor_id);
    }
    return found_distributor;
  }

  get_all_distributors(): PhysicalDistributor[] {
    return this.distributors.to_array();
  }

  get_active_distributors(): PhysicalDistributor[] {
    return this.distributors.filter((distributor) => distributor.is_active);
  }

  search(criteria: DistributorSearchCriteria): PhysicalDistributor[] {
    const normalized_term = normalize_text_for_search(criteria.search_term ?? "");
    return this.distributors.filter((distributor) => {
      if (!distributor.is_active) {
        return false;
      }
      const department_matches =
        criteria.department === undefined ||
        criteria.department.length === 0 ||
        distributor.department === criteria.department;
      const brand_matches =
        criteria.brand_code === undefined || distributor.supports_brand(criteria.brand_code);
      const o2o_matches = criteria.o2o_only !== true || distributor.is_o2o_enabled;
      const search_matches =
        normalized_term.length === 0 ||
        normalize_text_for_search(
          [
            distributor.trade_name,
            distributor.city,
            distributor.department,
            distributor.address_line,
            distributor.brand_names.join(" "),
          ].join(" "),
        ).includes(normalized_term);
      return department_matches && brand_matches && o2o_matches && search_matches;
    });
  }

  get_department_facets(): DepartmentFacet[] {
    const department_names = Array.from(
      new Set(this.get_active_distributors().map((distributor) => distributor.department)),
    ).sort((first_department, second_department) =>
      first_department.localeCompare(second_department, "es"),
    );
    return department_names.map((department) => ({
      department,
      count: this.get_active_distributors().filter(
        (distributor) => distributor.department === department,
      ).length,
    }));
  }

  get_distributors_by_advisor(advisor_id: string): PhysicalDistributor[] {
    return this.distributors.filter(
      (distributor) => distributor.is_active && distributor.advisor_id === advisor_id,
    );
  }

  get_all_records(): PhysicalDistributorRecord[] {
    return this.distributors.map((distributor) => distributor.to_plain_record());
  }

  get_active_records(): PhysicalDistributorRecord[] {
    return this.get_active_distributors().map((distributor) => distributor.to_plain_record());
  }
}
