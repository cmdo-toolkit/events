export type EventFactoryPayload<Event extends EventBase> = EventFactoryData<Event> & EventFactoryMeta<Event>;

type EventFactoryData<Event extends EventBase> = Event["data"] extends never
  ? {
      data?: undefined;
    }
  : {
      data: Event["data"];
    };

type EventFactoryMeta<Event extends EventBase> = Event["meta"] extends never
  ? {
      meta?: undefined;
    }
  : {
      meta: Event["meta"];
    };

export type EventBase<EventType = unknown, EventData = unknown | never, EventMeta = unknown | never> = {
  /**
   * Event identifier describing the intent of the event in a past
   * tense format.
   */
  type: EventType;

  /**
   * Contains the events data attributes directly related to the
   * event content.
   */
  data: EventData;

  /**
   * Contains additional meta details about the event that is not
   * directly related to its data attributes.
   */
  meta: EventMeta;

  /**
   * Logical hybrid clock timestamp representing the wall time when
   * the event was created.
   */
  date: string;
};

export type EventRecord<Event extends EventBase = EventBase> = Event & {
  /**
   * Stream id identifies the stream which represents a single entity
   * sequence of events.
   */
  streamId: string;

  /**
   * Position of the event in the event store. This differs from the
   * date which represents when the event was created. Since events
   * can be created in a distributed manner events can be higher in
   * the chain, but created in the past relative to the events lower
   * in the event chain.
   */
  height: number;

  /**
   * Commit hash of the preceeding event in a entity stream. The
   * value is undefined if its the first event of the stream.
   */
  parent?: string;

  /**
   * Hash value of the event content exluding itself. This is the
   * hash used when generating the merkle tree and ensuring that the
   * event is logged correctly and without conflicts to its
   * corresponding stream.
   */
  commit: string;
};
