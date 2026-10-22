import { VesuvianaValidationException } from "@/core/exceptions/vesuviana_domain_exceptions";
import type { FieldErrorMap } from "@/core/types/vesuviana_domain_types";

export interface NormalizedAdminError {
  message: string;
  field_errors: FieldErrorMap;
}

export function normalize_admin_error(error: unknown): NormalizedAdminError {
  if (error instanceof VesuvianaValidationException) {
    return { message: error.message, field_errors: error.field_errors };
  }
  if (error instanceof Error) {
    return { message: error.message, field_errors: {} };
  }
  return { message: "Ocurrió un error inesperado. Intenta nuevamente.", field_errors: {} };
}
