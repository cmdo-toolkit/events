import { JSONType } from "./Shared";

export type EventClass<T> = {
  new (...args: any[]): T;
  type: string;
  genesis?: boolean;
};

export type EventDescriptor<Data extends JSONType = JSONType> = {
  stream: string;
  event: EventData<Data>;
  prevHash?: string;
};

export type EventData<EventData extends JSONType = JSONType> = {
  type: string;
  data: EventData;
  meta: EventMeta;
  hash: string;
};

export interface EventMeta {
  /**
   * Logical hybrid clock timestamp representing the time of
   * which the event was created.
   */
  created: string;
}
