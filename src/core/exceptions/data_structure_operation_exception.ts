export class DataStructureOperationException extends Error {
  private readonly attempted_operation: string;
  private readonly operation_reason: string;

  constructor(attempted_operation: string, operation_reason: string) {
    super(`${attempted_operation} failed: ${operation_reason}`);
    this.name = "DataStructureOperationException";
    this.attempted_operation = attempted_operation;
    this.operation_reason = operation_reason;
  }

  get operation_name(): string {
    return this.attempted_operation;
  }

  get failure_reason(): string {
    return this.operation_reason;
  }
}
