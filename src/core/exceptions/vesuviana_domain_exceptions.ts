import type { FieldErrorMap } from "@/core/types/vesuviana_domain_types";

export class VesuvianaDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VesuvianaDomainException";
  }
}

export class VesuvianaValidationException extends VesuvianaDomainException {
  field_errors: FieldErrorMap;

  constructor(message: string, field_errors: FieldErrorMap = {}) {
    super(message);
    this.name = "VesuvianaValidationException";
    this.field_errors = field_errors;
  }
}

export class VesuvianaNotFoundException extends VesuvianaDomainException {
  constructor(message: string) {
    super(message);
    this.name = "VesuvianaNotFoundException";
  }
}

export class VesuvianaConflictException extends VesuvianaDomainException {
  constructor(message: string) {
    super(message);
    this.name = "VesuvianaConflictException";
  }
}

export class VesuvianaAuthorizationException extends VesuvianaDomainException {
  constructor(message: string) {
    super(message);
    this.name = "VesuvianaAuthorizationException";
  }
}

export class VesuvianaStorageException extends VesuvianaDomainException {
  constructor(message: string) {
    super(message);
    this.name = "VesuvianaStorageException";
  }
}

export class VesuvianaImageProcessingException extends VesuvianaDomainException {
  constructor(message: string) {
    super(message);
    this.name = "VesuvianaImageProcessingException";
  }
}

export class VesuvianaConfigurationException extends VesuvianaDomainException {
  constructor(message: string) {
    super(message);
    this.name = "VesuvianaConfigurationException";
  }
}
