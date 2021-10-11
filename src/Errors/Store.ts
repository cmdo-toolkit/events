export class EventNotFoundError extends Error {
  public readonly type = "EventNotFoundError";

  constructor(type: string) {
    super(`Event Store Violation: Event '${type}' has no registered constructor`);
  }
}
