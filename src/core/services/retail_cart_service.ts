import { CustomQueue } from "../data_structures/custom_queue";
import { CosmeticProduct, CosmeticProductRecord } from "../entities/cosmetic_product";
import { RetailCartEntry, RetailCartEntryRecord } from "../entities/retail_cart_entry";
import { DomainValidationException } from "../exceptions/domain_validation_exception";
import { ResourceNotFoundException } from "../exceptions/resource_not_found_exception";

export class RetailCartService {
  private readonly cart_queue: CustomQueue<RetailCartEntry>;
  private entry_sequence: number;

  constructor() {
    this.cart_queue = new CustomQueue<RetailCartEntry>();
    this.entry_sequence = 0;
  }

  get line_count(): number {
    return this.cart_queue.size;
  }

  get item_count(): number {
    return this.cart_queue.to_array().reduce((total_units, entry) => total_units + entry.quantity, 0);
  }

  get total_in_cop(): number {
    return this.cart_queue.to_array().reduce((total_value, entry) => total_value + entry.line_total_in_cop, 0);
  }

  get is_empty(): boolean {
    return this.cart_queue.is_empty;
  }

  add_product(product: CosmeticProduct, quantity = 1): RetailCartEntry {
    return this.add_product_snapshot(product.to_plain_record(), quantity);
  }

  add_product_record(product_record: CosmeticProductRecord, quantity = 1): RetailCartEntry {
    return this.add_product_snapshot(product_record, quantity);
  }

  remove_product(product_sku: string): RetailCartEntry {
    const removed_entry = this.cart_queue.remove_first((entry) => entry.product_sku === product_sku);
    if (removed_entry === undefined) {
      throw new ResourceNotFoundException("RetailCartEntry", product_sku);
    }
    return removed_entry;
  }

  update_quantity(product_sku: string, new_quantity: number): RetailCartEntry {
    const existing_entry = this.cart_queue.find((entry) => entry.product_sku === product_sku);
    if (existing_entry === undefined) {
      throw new ResourceNotFoundException("RetailCartEntry", product_sku);
    }
    if (!Number.isInteger(new_quantity) || new_quantity < 0) {
      throw new DomainValidationException(
        "new_quantity",
        "new_quantity must be a non-negative integer",
        new_quantity,
      );
    }
    if (new_quantity === 0) {
      this.remove_product(product_sku);
      return existing_entry;
    }
    existing_entry.update_quantity(new_quantity);
    return existing_entry;
  }

  contains_product(product_sku: string): boolean {
    return this.cart_queue.find((entry) => entry.product_sku === product_sku) !== undefined;
  }

  get_entries(): RetailCartEntry[] {
    return this.cart_queue.to_array();
  }

  get_entry_records(): RetailCartEntryRecord[] {
    return this.cart_queue.map((entry) => entry.to_plain_record());
  }

  checkout_order(): RetailCartEntryRecord[] {
    if (this.cart_queue.is_empty) {
      throw new DomainValidationException("cart_queue", "cannot create an order from an empty cart", this.cart_queue.size);
    }
    return this.cart_queue.drain().map((entry) => entry.to_plain_record());
  }

  clear(): void {
    this.cart_queue.clear();
  }

  private validate_quantity(quantity: number): number {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new DomainValidationException("quantity", "quantity must be a positive integer", quantity);
    }
    return quantity;
  }

  private add_product_snapshot(product_record: CosmeticProductRecord, quantity: number): RetailCartEntry {
    const validated_quantity = this.validate_quantity(quantity);
    const existing_entry = this.cart_queue.find(
      (entry) => entry.product_sku === product_record.product_sku,
    );
    if (existing_entry !== undefined) {
      existing_entry.increment_quantity(validated_quantity);
      return existing_entry;
    }
    this.entry_sequence += 1;
    const new_entry = new RetailCartEntry({
      entry_id: `cart-entry-${this.entry_sequence}`,
      product_id: product_record.product_id,
      product_sku: product_record.product_sku,
      product_name: product_record.product_name,
      brand_code: product_record.brand_code,
      unit_price_in_cop: product_record.retail_price_in_cop,
      quantity: validated_quantity,
    });
    this.cart_queue.enqueue(new_entry);
    return new_entry;
  }
}
