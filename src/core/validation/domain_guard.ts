import { DomainValidationException } from "../exceptions/domain_validation_exception";

export class DomainGuard {
  static require_non_empty_string(value: unknown, field_name: string): string {
    if (typeof value !== "string") {
      throw new DomainValidationException(field_name, `${field_name} must be a string`, value);
    }
    const normalized_value = value.trim();
    if (normalized_value.length === 0) {
      throw new DomainValidationException(field_name, `${field_name} cannot be empty`, value);
    }
    return normalized_value;
  }

  static require_positive_integer(value: unknown, field_name: string): number {
    if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
      throw new DomainValidationException(field_name, `${field_name} must be a positive integer`, value);
    }
    return value;
  }

  static require_non_negative_integer(value: unknown, field_name: string): number {
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      throw new DomainValidationException(field_name, `${field_name} must be a non-negative integer`, value);
    }
    return value;
  }

  static require_number_in_range(
    value: unknown,
    field_name: string,
    minimum_value: number,
    maximum_value: number,
  ): number {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new DomainValidationException(field_name, `${field_name} must be a finite number`, value);
    }
    if (value < minimum_value || value > maximum_value) {
      throw new DomainValidationException(
        field_name,
        `${field_name} must be between ${minimum_value} and ${maximum_value}`,
        value,
      );
    }
    return value;
  }

  static require_percentage(value: unknown, field_name: string): number {
    return DomainGuard.require_number_in_range(value, field_name, 0, 100);
  }

  static require_email(value: unknown, field_name: string): string {
    const normalized_value = DomainGuard.require_non_empty_string(value, field_name).toLowerCase();
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email_pattern.test(normalized_value)) {
      throw new DomainValidationException(field_name, `${field_name} must be a valid email address`, value);
    }
    return normalized_value;
  }

  static require_phone(value: unknown, field_name: string): string {
    const normalized_value = DomainGuard.require_non_empty_string(value, field_name);
    const digit_count = normalized_value.replace(/\D/g, "").length;
    if (digit_count < 7 || digit_count > 15) {
      throw new DomainValidationException(field_name, `${field_name} must contain between 7 and 15 digits`, value);
    }
    return normalized_value;
  }

  static require_enum_value<AllowedValue extends string>(
    value: unknown,
    allowed_values: readonly AllowedValue[],
    field_name: string,
  ): AllowedValue {
    if (typeof value !== "string" || !allowed_values.includes(value as AllowedValue)) {
      throw new DomainValidationException(
        field_name,
        `${field_name} must be one of: ${allowed_values.join(", ")}`,
        value,
      );
    }
    return value as AllowedValue;
  }

  static require_non_empty_string_collection(value: unknown, field_name: string): string[] {
    if (!Array.isArray(value) || value.length === 0) {
      throw new DomainValidationException(field_name, `${field_name} must contain at least one value`, value);
    }
    const normalized_values = value.map((entry) => DomainGuard.require_non_empty_string(entry, field_name));
    return Array.from(new Set(normalized_values));
  }

  static require_enum_collection<AllowedValue extends string>(
    value: unknown,
    allowed_values: readonly AllowedValue[],
    field_name: string,
  ): AllowedValue[] {
    if (!Array.isArray(value) || value.length === 0) {
      throw new DomainValidationException(field_name, `${field_name} must contain at least one value`, value);
    }
    const validated_values = value.map((entry) =>
      DomainGuard.require_enum_value(entry, allowed_values, field_name),
    );
    return Array.from(new Set(validated_values));
  }

  static require_optional_enum_collection<AllowedValue extends string>(
    value: unknown,
    allowed_values: readonly AllowedValue[],
    field_name: string,
  ): AllowedValue[] {
    if (!Array.isArray(value)) {
      throw new DomainValidationException(field_name, `${field_name} must be an array`, value);
    }
    const validated_values = value.map((entry) =>
      DomainGuard.require_enum_value(entry, allowed_values, field_name),
    );
    return Array.from(new Set(validated_values));
  }

  static require_latitude(value: unknown, field_name: string): number {
    return DomainGuard.require_number_in_range(value, field_name, -90, 90);
  }

  static require_longitude(value: unknown, field_name: string): number {
    return DomainGuard.require_number_in_range(value, field_name, -180, 180);
  }

  static require_iso_timestamp(value: unknown, field_name: string): string {
    const normalized_value = DomainGuard.require_non_empty_string(value, field_name);
    const parsed_timestamp = Date.parse(normalized_value);
    if (Number.isNaN(parsed_timestamp)) {
      throw new DomainValidationException(field_name, `${field_name} must be a valid ISO timestamp`, value);
    }
    return new Date(parsed_timestamp).toISOString();
  }

  static require_boolean(value: unknown, field_name: string): boolean {
    if (typeof value !== "boolean") {
      throw new DomainValidationException(field_name, `${field_name} must be a boolean`, value);
    }
    return value;
  }

  static require_positive_number(value: unknown, field_name: string): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      throw new DomainValidationException(field_name, `${field_name} must be a positive number`, value);
    }
    return value;
  }
}
