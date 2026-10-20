import { DataStructureOperationException } from "../exceptions/data_structure_operation_exception";

class StackCell<T> {
  public stored_value: T;
  public previous_cell: StackCell<T> | null;

  constructor(stored_value: T, previous_cell: StackCell<T> | null) {
    this.stored_value = stored_value;
    this.previous_cell = previous_cell;
  }
}

export class CustomStack<T> {
  private top_cell: StackCell<T> | null;
  private stored_count: number;

  constructor(initial_values: readonly T[] = []) {
    this.top_cell = null;
    this.stored_count = 0;
    initial_values.forEach((initial_value) => this.push(initial_value));
  }

  get size(): number {
    return this.stored_count;
  }

  get is_empty(): boolean {
    return this.stored_count === 0;
  }

  push(value: T): void {
    this.top_cell = new StackCell(value, this.top_cell);
    this.stored_count += 1;
  }

  pop(): T {
    if (this.top_cell === null) {
      throw new DataStructureOperationException("pop", "the stack is empty");
    }
    const removed_value = this.top_cell.stored_value;
    this.top_cell = this.top_cell.previous_cell;
    this.stored_count -= 1;
    return removed_value;
  }

  peek(): T {
    if (this.top_cell === null) {
      throw new DataStructureOperationException("peek", "the stack is empty");
    }
    return this.top_cell.stored_value;
  }

  clear(): void {
    this.top_cell = null;
    this.stored_count = 0;
  }

  to_array(): T[] {
    const stored_values: T[] = [];
    let current_cell = this.top_cell;
    while (current_cell !== null) {
      stored_values.push(current_cell.stored_value);
      current_cell = current_cell.previous_cell;
    }
    return stored_values;
  }

  drain(): T[] {
    const drained_values = this.to_array();
    this.clear();
    return drained_values;
  }
}
