import { JSONType } from "./Shared";

export type EventClass<T> = {
  new (...args: any[]): T;
  type: string;
};

export type JSONEvent<D extends JSONType = JSONType, M extends JSONType = JSONType> = {
  type: string;
  data: D;
  meta: JSONEventMeta<M>;
};

export type JSONEventMeta<Meta = JSONType> = {
  revised: string;
  created: string;
} & Meta;
