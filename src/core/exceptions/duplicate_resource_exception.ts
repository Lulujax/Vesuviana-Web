export class DuplicateResourceException extends Error {
  private readonly duplicated_resource_type: string;
  private readonly duplicated_resource_key: string;

  constructor(duplicated_resource_type: string, duplicated_resource_key: string) {
    super(`${duplicated_resource_type} with key "${duplicated_resource_key}" already exists`);
    this.name = "DuplicateResourceException";
    this.duplicated_resource_type = duplicated_resource_type;
    this.duplicated_resource_key = duplicated_resource_key;
  }

  get resource_type(): string {
    return this.duplicated_resource_type;
  }

  get resource_key(): string {
    return this.duplicated_resource_key;
  }
}
