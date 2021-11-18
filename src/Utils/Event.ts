import * as CryptoJS from "crypto-js";

import type { EventHash, EventMeta, EventRecord } from "../Types/Event";
import { getLogicalTimestamp } from "../Utils/Timestamp";

export function getEventFactory<Record extends EventRecord<Record["type"], Record["data"]>>(type: Record["type"]) {
  return function (data: Record["data"], meta: Partial<EventMeta> = {}) {
    const event = { type, data, meta: getEventMeta(meta) } as Omit<Record, "hash">;
    return Object.freeze({ ...event, hash: getEventHash(event) }) as Readonly<Record>;
  };
}

export function getRebasedEvent<Record extends EventRecord>({ type, data, meta }: Record, parent: string) {
  const event = { type, data, meta } as Omit<Record, "hash">;
  return Object.freeze({ ...event, hash: getEventHash(event, parent) }) as Readonly<Record>;
}

export function getEventMeta(meta: Partial<EventMeta> = {} as EventMeta): EventMeta {
  return { ...meta, timestamp: getLogicalTimestamp() };
}

export function getEventHash<Record extends EventRecord>(event: Omit<Record, "hash">, parent?: string): EventHash {
  return { commit: CryptoJS.SHA256(JSON.stringify(event)).toString(), parent };
}
