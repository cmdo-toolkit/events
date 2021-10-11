import type { Descriptor } from "../Types/Store";

export function byRevised(a: Descriptor, b: Descriptor): number {
  if (a.event.meta.revised > b.event.meta.revised) {
    return 1;
  }
  return -1;
}

export function byCreated(a: Descriptor, b: Descriptor): number {
  if (a.event.meta.created > b.event.meta.created) {
    return 1;
  }
  return -1;
}

export function byReversedCreated(a: Descriptor, b: Descriptor): number {
  if (a.event.meta.created < b.event.meta.created) {
    return 1;
  }
  return -1;
}
