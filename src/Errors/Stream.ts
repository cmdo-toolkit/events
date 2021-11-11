export class StreamNotFoundError extends Error {
  public readonly type = "StreamNotFoundError";

  constructor(name: string) {
    super(`Stream Violation: Cannot append incoming descriptor, stream ${name} does not exist`);
  }
}

export class StreamPrevHashError extends Error {
  public readonly type = "StreamPrevHashError";

  public readonly expected: string;
  public readonly received?: string;

  constructor(name: string, expected: string, received?: string) {
    super(`Stream Violation: Cannot append incoming descriptor, stream ${name} expected prevHash is invalid`);
    this.expected = expected;
    this.received = received;
  }
}
