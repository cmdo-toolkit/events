import { EventDescriptor } from "../Types/Event";

export function byCreated(a: EventDescriptor, b: EventDescriptor): number {
  if (a.event.meta.created > b.event.meta.created) {
    return 1;
  }
  return -1;
}

export function byReversedCreated(a: EventDescriptor, b: EventDescriptor): number {
  if (a.event.meta.created < b.event.meta.created) {
    return 1;
  }
  return -1;
}
