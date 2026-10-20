export class ResourceNotFoundException extends Error {
  private readonly missing_resource_type: string;
  private readonly missing_resource_key: string;

  constructor(missing_resource_type: string, missing_resource_key: string) {
    super(`${missing_resource_type} with key "${missing_resource_key}" was not found`);
    this.name = "ResourceNotFoundException";
    this.missing_resource_type = missing_resource_type;
    this.missing_resource_key = missing_resource_key;
  }

  get resource_type(): string {
    return this.missing_resource_type;
  }

  get resource_key(): string {
    return this.missing_resource_key;
  }
}
