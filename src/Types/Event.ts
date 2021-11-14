import { JSONType } from "./Shared";

export type EventClass<T> = {
  new (...args: any[]): T;
  type: string;
  genesis?: boolean;
};

export type EventDescriptor<Data extends JSONType = JSONType> = {
  /**
   * Stream this descriptor belongs to.
   */
  stream: string;

  /**
   * JSON representation of a instanced event. This is the data that
   * gets used to generate the descriptors hash value.
   */
  event: EventData<Data>;

  /**
   * A hashed value of the event value of the descriptor. This is also
   * used for the top layer when generating a merkle tree.
   */
  hash: string;

  /**
   * Previous event descriptor hash this descriptor is chained to.
   * When performing a push operation, if the push target latest
   * descriptor does not match the prevHash value we need to perform
   * a pull.
   */
  prevHash?: string;

  /**
   * A list of heads designating the target position that a peer was
   * last reporting on this event stream. This allows us to send this
   * events hash when we want to push events that the peer has not
   * yet seen.
   */
  heads?: string[];
};

export type EventData<EventData extends JSONType = JSONType> = {
  type: string;
  data: EventData;
  meta: EventMeta;
};

export interface EventMeta {
  /**
   * Logical hybrid clock timestamp representing the time of
   * which the event was created.
   */
  created: string;
}
