import { EventRecord } from "../Types/Event";

export function byCreated(a: EventRecord, b: EventRecord): number {
  if (a.date > b.date) {
    return 1;
  }
  return -1;
}

export function byReversedCreated(a: EventRecord, b: EventRecord): number {
  if (a.date < b.date) {
    return 1;
  }
  return -1;
}
