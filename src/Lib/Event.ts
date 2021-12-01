import * as CryptoJS from "crypto-js";

import type { EventBase, EventFactoryPayload, EventRecord } from "../Types/Event";
import { getLogicalTimestamp } from "../Utils/Timestamp";

export function createEvent<Event extends EventBase>(type: Event["type"]) {
  return function (payload: EventFactoryPayload<Event>) {
    return getEvent(type, payload.data, payload.meta);
  };
}

export function createEventRecord<Event extends EventBase>(
  streamId: string,
  event: Event,
  { height = 0, parent }: { height: number; parent?: string }
) {
  const record = { streamId, ...event, height, parent };
  return Object.freeze({
    ...record,
    commit: CryptoJS.SHA256(JSON.stringify(record)).toString()
  }) as Readonly<EventRecord<Event>>;
}

function getEvent<Event extends EventBase>(type: Event["type"], data: Event["data"] = {}, meta: Event["meta"] = {}) {
  return {
    type,
    data,
    meta,
    date: getLogicalTimestamp()
  } as Event;
}
