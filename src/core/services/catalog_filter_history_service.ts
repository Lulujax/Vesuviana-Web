import { CustomStack } from "../data_structures/custom_stack";
import { CatalogFilterSnapshot } from "../entities/catalog_filter_snapshot";
import { DomainValidationException } from "../exceptions/domain_validation_exception";

export class CatalogFilterHistoryService {
  private readonly history_stack: CustomStack<CatalogFilterSnapshot>;
  private readonly maximum_depth: number;

  constructor(maximum_depth = 15) {
    if (!Number.isInteger(maximum_depth) || maximum_depth <= 0) {
      throw new DomainValidationException("maximum_depth", "maximum_depth must be a positive integer", maximum_depth);
    }
    this.history_stack = new CustomStack<CatalogFilterSnapshot>();
    this.maximum_depth = maximum_depth;
  }

  get size(): number {
    return this.history_stack.size;
  }

  get maximum_history_depth(): number {
    return this.maximum_depth;
  }

  record_snapshot(snapshot: CatalogFilterSnapshot): boolean {
    if (!this.history_stack.is_empty) {
      const current_snapshot = this.history_stack.peek();
      if (current_snapshot.filter_signature === snapshot.filter_signature) {
        return false;
      }
    }
    this.history_stack.push(snapshot);
    this.trim_history();
    return true;
  }

  current_snapshot(): CatalogFilterSnapshot | undefined {
    return this.history_stack.is_empty ? undefined : this.history_stack.peek();
  }

  undo_last_filter(): CatalogFilterSnapshot | undefined {
    if (this.history_stack.is_empty) {
      return undefined;
    }
    this.history_stack.pop();
    return this.history_stack.is_empty ? undefined : this.history_stack.peek();
  }

  recent_snapshots(maximum_results = this.maximum_depth): CatalogFilterSnapshot[] {
    if (!Number.isInteger(maximum_results) || maximum_results <= 0) {
      throw new DomainValidationException(
        "maximum_results",
        "maximum_results must be a positive integer",
        maximum_results,
      );
    }
    return this.history_stack.to_array().slice(0, maximum_results);
  }

  clear(): void {
    this.history_stack.clear();
  }

  private trim_history(): void {
    if (this.history_stack.size <= this.maximum_depth) {
      return;
    }
    const retained_snapshots = this.history_stack.to_array().slice(0, this.maximum_depth);
    this.history_stack.clear();
    for (let current_index = retained_snapshots.length - 1; current_index >= 0; current_index -= 1) {
      this.history_stack.push(retained_snapshots[current_index]);
    }
  }
}
