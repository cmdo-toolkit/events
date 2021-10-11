import { JSONEventMeta } from "../Types/Event";
import { JSONType } from "../Types/Shared";
import { getLogicalTimestamp } from "./Timestamp";

export function getEventData<Data extends JSONType>(data: Partial<Data> = {}): Data {
  return Object.freeze(data) as Data;
}

export function getEventMeta<Meta extends JSONEventMeta>(meta: Partial<Meta> = {}): Meta {
  const revised = meta.revised ?? getLogicalTimestamp();
  return Object.freeze({ ...meta, revised, created: revised }) as Meta;
}
