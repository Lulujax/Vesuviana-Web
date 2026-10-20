import { DataStructureOperationException } from "../exceptions/data_structure_operation_exception";

class LinkedListCell<T> {
  public stored_value: T;
  public next_cell: LinkedListCell<T> | null;

  constructor(stored_value: T) {
    this.stored_value = stored_value;
    this.next_cell = null;
  }
}

export class CustomLinkedList<T> {
  private head_cell: LinkedListCell<T> | null;
  private tail_cell: LinkedListCell<T> | null;
  private stored_count: number;

  constructor(initial_values: readonly T[] = []) {
    this.head_cell = null;
    this.tail_cell = null;
    this.stored_count = 0;
    initial_values.forEach((initial_value) => this.append(initial_value));
  }

  get size(): number {
    return this.stored_count;
  }

  get is_empty(): boolean {
    return this.stored_count === 0;
  }

  append(value: T): void {
    const new_cell = new LinkedListCell(value);
    if (this.tail_cell === null) {
      this.head_cell = new_cell;
      this.tail_cell = new_cell;
    } else {
      this.tail_cell.next_cell = new_cell;
      this.tail_cell = new_cell;
    }
    this.stored_count += 1;
  }

  prepend(value: T): void {
    const new_cell = new LinkedListCell(value);
    if (this.head_cell === null) {
      this.head_cell = new_cell;
      this.tail_cell = new_cell;
    } else {
      new_cell.next_cell = this.head_cell;
      this.head_cell = new_cell;
    }
    this.stored_count += 1;
  }

  insert_at(index: number, value: T): void {
    this.require_valid_position(index, true);
    if (index === 0) {
      this.prepend(value);
      return;
    }
    if (index === this.stored_count) {
      this.append(value);
      return;
    }
    const previous_cell = this.get_cell_at(index - 1);
    const new_cell = new LinkedListCell(value);
    new_cell.next_cell = previous_cell.next_cell;
    previous_cell.next_cell = new_cell;
    this.stored_count += 1;
  }

  get_at(index: number): T {
    return this.get_cell_at(index).stored_value;
  }

  find_index(predicate: (value: T, index: number) => boolean): number {
    let current_cell = this.head_cell;
    let current_index = 0;
    while (current_cell !== null) {
      if (predicate(current_cell.stored_value, current_index)) {
        return current_index;
      }
      current_cell = current_cell.next_cell;
      current_index += 1;
    }
    return -1;
  }

  find(predicate: (value: T, index: number) => boolean): T | undefined {
    const found_index = this.find_index(predicate);
    return found_index === -1 ? undefined : this.get_at(found_index);
  }

  contains(predicate: (value: T, index: number) => boolean): boolean {
    return this.find_index(predicate) !== -1;
  }

  remove(value: T): boolean {
    const found_index = this.find_index((stored_value) => Object.is(stored_value, value));
    if (found_index === -1) {
      return false;
    }
    this.remove_at(found_index);
    return true;
  }

  remove_first(predicate: (value: T, index: number) => boolean): T | undefined {
    let current_cell = this.head_cell;
    let previous_cell: LinkedListCell<T> | null = null;
    let current_index = 0;
    while (current_cell !== null) {
      if (predicate(current_cell.stored_value, current_index)) {
        if (previous_cell === null) {
          this.head_cell = current_cell.next_cell;
        } else {
          previous_cell.next_cell = current_cell.next_cell;
        }
        if (current_cell === this.tail_cell) {
          this.tail_cell = previous_cell;
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

  remove_at(index: number): T {
    this.require_valid_position(index, false);
    let current_cell = this.head_cell as LinkedListCell<T>;
    let previous_cell: LinkedListCell<T> | null = null;
    let current_index = 0;
    while (current_index < index) {
      previous_cell = current_cell;
      current_cell = current_cell.next_cell as LinkedListCell<T>;
      current_index += 1;
    }
    if (previous_cell === null) {
      this.head_cell = current_cell.next_cell;
    } else {
      previous_cell.next_cell = current_cell.next_cell;
    }
    if (current_cell === this.tail_cell) {
      this.tail_cell = previous_cell;
    }
    this.stored_count -= 1;
    return current_cell.stored_value;
  }

  clear(): void {
    this.head_cell = null;
    this.tail_cell = null;
    this.stored_count = 0;
  }

  for_each(callback: (value: T, index: number) => void): void {
    let current_cell = this.head_cell;
    let current_index = 0;
    while (current_cell !== null) {
      callback(current_cell.stored_value, current_index);
      current_cell = current_cell.next_cell;
      current_index += 1;
    }
  }

  map<ResultValue>(transformer: (value: T, index: number) => ResultValue): ResultValue[] {
    const transformed_values: ResultValue[] = [];
    this.for_each((stored_value, current_index) => {
      transformed_values.push(transformer(stored_value, current_index));
    });
    return transformed_values;
  }

  filter(predicate: (value: T, index: number) => boolean): T[] {
    const filtered_values: T[] = [];
    this.for_each((stored_value, current_index) => {
      if (predicate(stored_value, current_index)) {
        filtered_values.push(stored_value);
      }
    });
    return filtered_values;
  }

  to_array(): T[] {
    return this.map((stored_value) => stored_value);
  }

  reverse_in_place(): void {
    let previous_cell: LinkedListCell<T> | null = null;
    let current_cell = this.head_cell;
    this.tail_cell = this.head_cell;
    while (current_cell !== null) {
      const next_cell = current_cell.next_cell;
      current_cell.next_cell = previous_cell;
      previous_cell = current_cell;
      current_cell = next_cell;
    }
    this.head_cell = previous_cell;
  }

  private get_cell_at(index: number): LinkedListCell<T> {
    this.require_valid_position(index, false);
    let current_cell = this.head_cell as LinkedListCell<T>;
    let current_index = 0;
    while (current_index < index) {
      current_cell = current_cell.next_cell as LinkedListCell<T>;
      current_index += 1;
    }
    return current_cell;
  }

  private require_valid_position(index: number, allow_end_position: boolean): void {
    if (!Number.isInteger(index)) {
      throw new DataStructureOperationException("index_validation", "the index must be an integer");
    }
    const maximum_index = allow_end_position ? this.stored_count : this.stored_count - 1;
    if (index < 0 || index > maximum_index) {
      throw new DataStructureOperationException(
        "index_validation",
        `the index ${index} is outside the valid range 0-${maximum_index}`,
      );
    }
  }
}
