import { DomainValidationException } from "../exceptions/domain_validation_exception";
import { DomainGuard } from "../validation/domain_guard";

export class PortfolioDiagnosticMatrix {
  private readonly header_values: readonly string[];
  private readonly row_values: readonly (readonly string[])[];

  constructor(headers: readonly string[], rows: readonly (readonly string[])[]) {
    if (!Array.isArray(headers) || headers.length < 2) {
      throw new DomainValidationException(
        "headers",
        "diagnostic matrix requires at least two columns",
        headers,
      );
    }
    this.header_values = headers.map((header) =>
      DomainGuard.require_non_empty_string(header, "diagnostic_matrix_header"),
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new DomainValidationException("rows", "diagnostic matrix requires at least one row", rows);
    }
    this.row_values = rows.map((row) => {
      if (!Array.isArray(row) || row.length !== this.header_values.length) {
        throw new DomainValidationException(
          "diagnostic_matrix_row",
          `each diagnostic matrix row must contain exactly ${this.header_values.length} cells`,
          row,
        );
      }
      return row.map((cell) => DomainGuard.require_non_empty_string(cell, "diagnostic_matrix_cell"));
    });
  }

  get headers(): readonly string[] {
    return [...this.header_values];
  }

  get rows(): readonly (readonly string[])[] {
    return this.row_values.map((row) => [...row]);
  }

  get row_count(): number {
    return this.row_values.length;
  }

  get column_count(): number {
    return this.header_values.length;
  }

  get raw_matrix(): string[][] {
    return [[...this.header_values], ...this.row_values.map((row) => [...row])];
  }

  get_row_at(row_index: number): string[] {
    if (!Number.isInteger(row_index) || row_index < 0 || row_index >= this.row_values.length) {
      throw new DomainValidationException(
        "row_index",
        `row_index must be between 0 and ${this.row_values.length - 1}`,
        row_index,
      );
    }
    return [...this.row_values[row_index]];
  }

  find_rows_by_first_column(column_value: string): string[][] {
    const normalized_value = column_value.trim().toLowerCase();
    return this.row_values
      .filter((row) => row[0].toLowerCase() === normalized_value)
      .map((row) => [...row]);
  }

  get_column_values(column_index: number): string[] {
    if (!Number.isInteger(column_index) || column_index < 0 || column_index >= this.header_values.length) {
      throw new DomainValidationException(
        "column_index",
        `column_index must be between 0 and ${this.header_values.length - 1}`,
        column_index,
      );
    }
    return this.row_values.map((row) => row[column_index]);
  }
}
