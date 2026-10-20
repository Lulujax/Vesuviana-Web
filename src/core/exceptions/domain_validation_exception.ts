export interface DomainValidationRecord {
  error_name: string;
  invalid_field_name: string;
  validation_message: string;
  rejected_value: unknown;
}

export class DomainValidationException extends Error {
  private readonly invalid_field: string;
  private readonly rejected_value_snapshot: unknown;

  constructor(invalid_field: string, validation_message: string, rejected_value_snapshot?: unknown) {
    super(validation_message);
    this.name = "DomainValidationException";
    this.invalid_field = invalid_field;
    this.rejected_value_snapshot = rejected_value_snapshot;
  }

  get invalid_field_name(): string {
    return this.invalid_field;
  }

  get rejected_value(): unknown {
    return this.rejected_value_snapshot;
  }

  to_plain_record(): DomainValidationRecord {
    return {
      error_name: this.name,
      invalid_field_name: this.invalid_field,
      validation_message: this.message,
      rejected_value: this.rejected_value_snapshot,
    };
  }
}
