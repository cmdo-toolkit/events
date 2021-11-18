import type { EventRecord } from "../Types/Event";

export interface EventStore {
  /**
   * Append the given event json object and return the recorded event.
   */
  append(event: EventRecord): Promise<EventRecord>;

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
   * return events.find(filter).sort({ "event.meta.timestamp": 1 }).toArray();
   * ```
   *
   */
  getByStream(stream: string, cursor?: string, direction?: -1 | 1): Promise<EventRecord[]>;

  /**
   * Get the last recorded event in given event stream.
   *
   * @example
   *
   * ```
   * return events.findOne({ stream }).sort({ "event.meta.timestamp": -1 });
   * ```
   *
   */
  getLastEventByStream(stream: string): Promise<EventRecord | undefined>;

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
   *   "event.meta.timestamp": {
   *     $gt: event.meta.timestamp
   *   }
   * }) > 0
   * ```
   */
  outdated(event: EventRecord): Promise<boolean>;
}
