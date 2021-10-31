import { JSONEvent } from "./Event";
import { JSONType } from "./Shared";

export type Descriptor<D extends JSONType = JSONType, M extends JSONType = JSONType> = {
  id: string;
  streams: string[];
  event: JSONEvent<D, M>;
};
