import { EventRecord } from "../Types/Event";

export function byCreated(a: EventRecord, b: EventRecord): number {
  if (a.meta.timestamp > b.meta.timestamp) {
    return 1;
  }
  return -1;
}

export function byReversedCreated(a: EventRecord, b: EventRecord): number {
  if (a.meta.timestamp < b.meta.timestamp) {
    return 1;
  }
  return -1;
}
