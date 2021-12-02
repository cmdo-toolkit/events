import type { StreamSubscriptionHandler } from "..";
import type { EventBase } from "../Types/Event";
import type { ReduceHandler } from "../Types/Reducer";

export interface EventStream<Event extends EventBase = EventBase> {
  /**
   * Append given event record to the local event store.
   */
  append(streamId: string, event: Event): Promise<void>;

  /**
   * Get aggregated state from all events within the stream against
   * the provided reduce.
   */
  reduce<Reduce extends ReduceHandler>(streamId: string, reduce: Reduce): Promise<ReturnType<Reduce> | undefined>;

  /**
   * Get all recorded events for the given event stream.
   */
  getEvents(streamId: string): Promise<unknown[]>;

  /**
   * Get the latest event added to the given event stream.
   */
  getLastEvent(streamId: string): Promise<unknown | undefined | null>;

  /**
   * Subscribe to new events for a given stream.
   */
  subscribe(streamId: string, handler: StreamSubscriptionHandler): void;

  /**
   * Unsubscribe from the given stream.
   */
  unsubscribe(streamId: string): void;
}
