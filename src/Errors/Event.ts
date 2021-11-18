export class EventMissingParentHashError extends Error {
  public readonly type = "EventMissingParentHashError";

  constructor(type: string) {
    super(`Event Violation: Event '${type}' missing parent hash value.`);
  }
}
