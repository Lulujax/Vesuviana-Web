import { DataStructureOperationException } from "../exceptions/data_structure_operation_exception";

class QueueCell<T> {
  public stored_value: T;
  public next_cell: QueueCell<T> | null;

  constructor(stored_value: T) {
    this.stored_value = stored_value;
    this.next_cell = null;
  }
}

export class CustomQueue<T> {
  private front_cell: QueueCell<T> | null;
  private rear_cell: QueueCell<T> | null;
  private stored_count: number;

  constructor(initial_values: readonly T[] = []) {
    this.front_cell = null;
    this.rear_cell = null;
    this.stored_count = 0;
    initial_values.forEach((initial_value) => this.enqueue(initial_value));
  }

  get size(): number {
    return this.stored_count;
  }

  get is_empty(): boolean {
    return this.stored_count === 0;
  }

  enqueue(value: T): void {
    const new_cell = new QueueCell(value);
    if (this.rear_cell === null) {
      this.front_cell = new_cell;
      this.rear_cell = new_cell;
    } else {
      this.rear_cell.next_cell = new_cell;
      this.rear_cell = new_cell;
    }
    this.stored_count += 1;
  }

  enqueue_many(values: readonly T[]): void {
    values.forEach((value) => this.enqueue(value));
  }

  dequeue(): T {
    if (this.front_cell === null) {
      throw new DataStructureOperationException("dequeue", "the queue is empty");
    }
    const removed_value = this.front_cell.stored_value;
    this.front_cell = this.front_cell.next_cell;
    if (this.front_cell === null) {
      this.rear_cell = null;
    }
    this.stored_count -= 1;
    return removed_value;
  }

  peek(): T {
    if (this.front_cell === null) {
      throw new DataStructureOperationException("peek", "the queue is empty");
    }
    return this.front_cell.stored_value;
  }

  find(predicate: (value: T, index: number) => boolean): T | undefined {
    let current_cell = this.front_cell;
    let current_index = 0;
    while (current_cell !== null) {
      if (predicate(current_cell.stored_value, current_index)) {
        return current_cell.stored_value;
      }
      current_cell = current_cell.next_cell;
      current_index += 1;
    }
    return undefined;
  }

  remove_first(predicate: (value: T, index: number) => boolean): T | undefined {
    let current_cell = this.front_cell;
    let previous_cell: QueueCell<T> | null = null;
    let current_index = 0;
    while (current_cell !== null) {
      if (predicate(current_cell.stored_value, current_index)) {
        if (previous_cell === null) {
          this.front_cell = current_cell.next_cell;
        } else {
          previous_cell.next_cell = current_cell.next_cell;
        }
        if (current_cell === this.rear_cell) {
          this.rear_cell = previous_cell;
        }
        this.stored_count -= 1;
        return current_cell.stored_value;
      }
      previous_cell = current_cell;
      current_cell = current_cell.next_cell;
      current_index += 1;
    }
    return undefined;
  }

  clear(): void {
    this.front_cell = null;
    this.rear_cell = null;
    this.stored_count = 0;
  }

  to_array(): T[] {
    const stored_values: T[] = [];
    let current_cell = this.front_cell;
    while (current_cell !== null) {
      stored_values.push(current_cell.stored_value);
      current_cell = current_cell.next_cell;
    }
    return stored_values;
  }

  map<ResultValue>(transformer: (value: T, index: number) => ResultValue): ResultValue[] {
    const transformed_values: ResultValue[] = [];
    let current_cell = this.front_cell;
    let current_index = 0;
    while (current_cell !== null) {
      transformed_values.push(transformer(current_cell.stored_value, current_index));
      current_cell = current_cell.next_cell;
      current_index += 1;
    }
    return transformed_values;
  }

  filter(predicate: (value: T, index: number) => boolean): T[] {
    const filtered_values: T[] = [];
    let current_cell = this.front_cell;
    let current_index = 0;
    while (current_cell !== null) {
      if (predicate(current_cell.stored_value, current_index)) {
        filtered_values.push(current_cell.stored_value);
      }
      current_cell = current_cell.next_cell;
      current_index += 1;
    }
    return filtered_values;
  }

  drain(): T[] {
    const drained_values = this.to_array();
    this.clear();
    return drained_values;
  }
}
