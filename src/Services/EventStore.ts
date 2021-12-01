import type { EventBase, EventRecord } from "../Types/Event";

export interface EventStore<Event extends EventBase = EventBase, Record extends EventRecord<Event> = EventRecord<Event>> {
  /**
   * Append given event record to the local event store.
   */
  insert(record: Record, hydrated?: boolean): Promise<void>;

  /**
   * Check if given even has a newer version in the local event store.
   */
  outdated(record: EventRecord<Event>): Promise<boolean>;
}
