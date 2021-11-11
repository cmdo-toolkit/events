import { EventMeta } from "../Types/Event";
import { JSONType } from "../Types/Shared";
import { getLogicalTimestamp } from "../Utils/Timestamp";

export function getEventData<Data extends JSONType>(data: Partial<Data> = {}): Data {
  return Object.freeze(data) as Data;
}

export function getEventMeta<Meta extends EventMeta>(meta: Partial<Meta> = {}): Meta {
  return Object.freeze({
    created: meta.created ?? getLogicalTimestamp()
  }) as Meta;
}
