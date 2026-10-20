import {
  BrandCode,
  brand_codes,
  brand_labels,
  CommercialLevel,
  commercial_level_labels,
  commercial_levels,
  ProductFormat,
  product_format_labels,
  product_formats,
  ProductPurpose,
  product_purpose_labels,
  product_purposes,
} from "../domain/product_classification";
import { CustomLinkedList } from "../data_structures/custom_linked_list";
import { CosmeticProduct, CosmeticProductRecord } from "../entities/cosmetic_product";
import { DuplicateResourceException } from "../exceptions/duplicate_resource_exception";
import { DomainValidationException } from "../exceptions/domain_validation_exception";
import { ResourceNotFoundException } from "../exceptions/resource_not_found_exception";
import { normalize_text_for_search } from "../utils/text_formatters";

export interface CatalogSearchCriteria {
  search_term?: string;
  brand_codes?: readonly BrandCode[];
  product_formats?: readonly ProductFormat[];
  purpose_tags?: readonly ProductPurpose[];
  commercial_levels?: readonly CommercialLevel[];
}

export interface CatalogFacet {
  value: string;
  label: string;
  count: number;
}

export interface CatalogFacetCollection {
  brand_facets: CatalogFacet[];
  format_facets: CatalogFacet[];
  purpose_facets: CatalogFacet[];
  level_facets: CatalogFacet[];
}

export class ProductCatalogService {
  private readonly catalog: CustomLinkedList<CosmeticProduct>;

  constructor(initial_products: readonly CosmeticProduct[] = []) {
    this.catalog = new CustomLinkedList<CosmeticProduct>();
    initial_products.forEach((product) => this.add_product(product));
  }

  get size(): number {
    return this.catalog.size;
  }

  add_product(product: CosmeticProduct): void {
    if (this.catalog.contains((current_product) => current_product.product_sku === product.product_sku)) {
      throw new DuplicateResourceException("CosmeticProduct", product.product_sku);
    }
    if (this.catalog.contains((current_product) => current_product.product_id === product.product_id)) {
      throw new DuplicateResourceException("CosmeticProduct", product.product_id);
    }
    this.catalog.append(product);
  }

  remove_product_by_sku(product_sku: string): CosmeticProduct {
    const removed_product = this.catalog.remove_first(
      (current_product) => current_product.product_sku === product_sku,
    );
    if (removed_product === undefined) {
      throw new ResourceNotFoundException("CosmeticProduct", product_sku);
    }
    return removed_product;
  }

  get_by_sku(product_sku: string): CosmeticProduct {
    const found_product = this.catalog.find(
      (current_product) => current_product.product_sku === product_sku,
    );
    if (found_product === undefined) {
      throw new ResourceNotFoundException("CosmeticProduct", product_sku);
    }
    return found_product;
  }

  get_by_slug(product_slug: string): CosmeticProduct {
    const found_product = this.catalog.find(
      (current_product) => current_product.product_slug === product_slug,
    );
    if (found_product === undefined) {
      throw new ResourceNotFoundException("CosmeticProduct", product_slug);
    }
    return found_product;
  }

  get_all_products(): CosmeticProduct[] {
    return this.catalog.to_array();
  }

  get_all_records(): CosmeticProductRecord[] {
    return this.catalog.map((product) => product.to_plain_record());
  }

  get_products_by_brand(brand_code: BrandCode): CosmeticProduct[] {
    return this.catalog.filter((product) => product.brand_code === brand_code);
  }

  get_featured_products(maximum_results = 3): CosmeticProduct[] {
    const validated_limit = this.validate_limit(maximum_results);
    return this.catalog.filter((product) => product.is_featured).slice(0, validated_limit);
  }

  get_featured_products_by_brand(brand_code: BrandCode, maximum_results = 3): CosmeticProduct[] {
    const validated_limit = this.validate_limit(maximum_results);
    return this.catalog
      .filter((product) => product.brand_code === brand_code && product.is_featured)
      .slice(0, validated_limit);
  }

  search(criteria: CatalogSearchCriteria): CosmeticProduct[] {
    const normalized_search_term = normalize_text_for_search(criteria.search_term ?? "");
    return this.catalog.filter((product) => {
      const brand_matches =
        criteria.brand_codes === undefined ||
        criteria.brand_codes.length === 0 ||
        criteria.brand_codes.includes(product.brand_code);
      const format_matches =
        criteria.product_formats === undefined ||
        criteria.product_formats.length === 0 ||
        criteria.product_formats.includes(product.product_format);
      const purpose_matches =
        criteria.purpose_tags === undefined ||
        criteria.purpose_tags.length === 0 ||
        criteria.purpose_tags.some((purpose) => product.purpose_tags.includes(purpose));
      const level_matches =
        criteria.commercial_levels === undefined ||
        criteria.commercial_levels.length === 0 ||
        criteria.commercial_levels.includes(product.commercial_level);
      const search_matches =
        normalized_search_term.length === 0 ||
        this.build_search_document(product).includes(normalized_search_term);
      return brand_matches && format_matches && purpose_matches && level_matches && search_matches;
    });
  }

  get_related_products(product_sku: string, maximum_results = 3): CosmeticProduct[] {
    const validated_limit = this.validate_limit(maximum_results);
    const source_product = this.get_by_sku(product_sku);
    return this.catalog
      .filter((product) => product.product_sku !== source_product.product_sku)
      .map((product) => {
        const shared_purposes = product.purpose_tags.filter((purpose) =>
          source_product.purpose_tags.includes(purpose),
        ).length;
        const cross_brand_bonus = product.brand_code !== source_product.brand_code ? 2 : 0;
        const shared_layer_bonus = product.anatomical_layer === source_product.anatomical_layer ? 1 : 0;
        return { product, relevance_score: shared_purposes * 3 + cross_brand_bonus + shared_layer_bonus };
      })
      .sort((first_entry, second_entry) => second_entry.relevance_score - first_entry.relevance_score)
      .slice(0, validated_limit)
      .map((ranked_entry) => ranked_entry.product);
  }

  get_facets(): CatalogFacetCollection {
    const products = this.catalog.to_array();
    return {
      brand_facets: brand_codes.map((brand_code) => ({
        value: brand_code,
        label: brand_labels[brand_code],
        count: products.filter((product) => product.brand_code === brand_code).length,
      })),
      format_facets: product_formats.map((format) => ({
        value: format,
        label: product_format_labels[format],
        count: products.filter((product) => product.product_format === format).length,
      })),
      purpose_facets: product_purposes.map((purpose) => ({
        value: purpose,
        label: product_purpose_labels[purpose],
        count: products.filter((product) => product.purpose_tags.includes(purpose)).length,
      })),
      level_facets: commercial_levels.map((level) => ({
        value: level,
        label: commercial_level_labels[level],
        count: products.filter((product) => product.commercial_level === level).length,
      })),
    };
  }

  private build_search_document(product: CosmeticProduct): string {
    return normalize_text_for_search(
      [
        product.product_name,
        product.product_sku,
        product.brand_name,
        product.commercial_level_name,
        product.product_format_name,
        product.active_complexes.join(" "),
        product.purpose_labels.join(" "),
        product.technical_description,
        product.botanical_origin,
      ].join(" "),
    );
  }

  private validate_limit(maximum_results: number): number {
    if (!Number.isInteger(maximum_results) || maximum_results <= 0) {
      throw new DomainValidationException(
        "maximum_results",
        "maximum_results must be a positive integer",
        maximum_results,
      );
    }
    return maximum_results;
  }
}
