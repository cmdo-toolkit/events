import { EventNotFoundError } from "../Errors/Store";
import type { Event as BaseEvent } from "../Lib/Event";
import type { EventClass, EventDescriptor } from "../Types/Event";
import type { JSONType } from "../Types/Shared";

export abstract class EventStore<Event extends BaseEvent = BaseEvent> {
  public static readonly EventNotFoundError = EventNotFoundError;

  public readonly events: Record<string, any>;

  constructor(events: JSONType<EventClass<Event>>) {
    this.events = events;
    this.toEvent = this.toEvent.bind(this);
  }

  /**
   * Convert the event descriptor into a instanced event of the same type.
   */
  public toEvent(descriptor: EventDescriptor): Event {
    const event = this.events[descriptor.event.type];
    if (!event) {
      throw new EventNotFoundError(descriptor.event.type);
    }
    return event.from(descriptor);
  }

  /**
   * Insert the given event descriptor in the local data stores.
   *
   * @example
   *
   * ```
   * await events.insert(descriptor);
   * ```
   *
   */
  public abstract append(descriptor: EventDescriptor): Promise<EventDescriptor>;

  /**
   * Get a list of event descriptors for the given stream.
   *
   * @param name      - Name of the stream to fetch events from.
   * @param cursor    - Hash to start fetching events from.
   * @param direction - Which direction to get events based on the given cursor.
   *
   * @example
   *
   * ```
   * const filter = { stream };
   * if (cursor) {
   *   filter.hash = {
   *     [(direction ?? 1) === 1 ? "$gt" : "$lt"]: cursor
   *   }
   * }
   * return events.find(filter).sort({ "event.meta.created": 1 }).toArray();
   * ```
   *
   */
  public abstract getByStream(stream: string, cursor?: string, direction?: -1 | 1): Promise<EventDescriptor[]>;

  /**
   * Get the last recorded event in given event stream.
   *
   * @example
   *
   * ```
   * return events.findOne({ stream }).sort({ "event.meta.created": -1 });
   * ```
   *
   */
  public abstract getLastEventByStream(stream: string): Promise<EventDescriptor | undefined>;

  /**
   * Return a outdated check for the descriptor.
   *
   * @remarks
   *
   * The logic for this check is to see if there is an event of the same type and
   * event id that is newer than the given event descriptor.
   *
   * @example
   *
   * ```ts
   * count({
   *   "event.type": event.type,
   *   "event.meta.created": {
   *     $gt: event.meta.created
   *   }
   * }) > 0
   * ```
   */
  public abstract outdated(descriptor: EventDescriptor): Promise<boolean>;
}
