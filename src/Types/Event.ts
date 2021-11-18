export type EventRecord<EventType = unknown, Data = unknown> = {
  type: EventType;
  data: EventData<Data>;
  meta: EventMeta;
  hash: EventHash;
};

export type EventData<Data> = {
  /**
   * Id representing the primary identifier of the entity, aggregate,
   * stream, entity that the event belongs to.
   *
   * @remarks
   *
   * For example an account is identified by a primary id. This id
   * would be represented within the entity id of this event.
   */
  id: string;
} & Data;

export interface EventMeta {
  /**
   * Logical hybrid clock timestamp representing the wall time of
   * when the event was created.
   */
  timestamp: string;
}

export type EventHash = {
  /**
   * Hash value of the event type, data and meta details. This is the
   * hash used when generating the merkle tree.
   */
  commit: string;

  /**
   * Commit has of the preceeding event in a entity context stream.
   * This is assigned by the event store when the event is appended
   * to the stream.
   */
  parent?: string;
};
