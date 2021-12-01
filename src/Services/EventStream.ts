import type { EventBase, EventRecord } from "../Types/Event";
import { ReduceHandler } from "../Types/Reducer";

export interface EventStream<Event extends EventBase = EventBase> {
  /**
   * Append given event record to the local event store.
   */
  append<Event extends EventBase>(streamId: string, event: Event): Promise<void>;

  /**
   * Get aggregated state from all events within the stream against
   * the provided reduce.
   */
  reduce<Reduce extends ReduceHandler>(streamId: string, reduce: Reduce): Promise<ReturnType<Reduce> | undefined>;

  /**
   * Get all recorded events for the given event stream.
   */
  getEvents(streamId: string): Promise<EventRecord<Event>[]>;

  /**
   * Get the latest event added to the given event stream.
   */
  getLastEvent(streamId: string): Promise<EventRecord<Event> | undefined | null>;
}
