import { EventNotFoundError } from "../Errors/Store";
import { EventClass } from "../Types/Event";
import { JSONType } from "../Types/Shared";
import type { Descriptor } from "../Types/Store";
import { getLogicalTimestamp } from "../Utils/Timestamp";
import type { Event } from "./Event";
import { EventEmitter } from "./EventEmitter";
import { publisher } from "./Publisher";
import type { Reducer } from "./Reducer";

export abstract class Store<E extends Event = Event, D extends Descriptor = Descriptor> extends EventEmitter<{
  saved(descriptor: D): void;
}> {
  public static readonly EventNotFoundError = EventNotFoundError;

  public readonly events: Record<string, any>;

  constructor(events: JSONType<EventClass<E>>) {
    super();

    this.events = events;

    this.save = this.save.bind(this);
    this.add = this.add.bind(this);

    this.toRevisedEvent = this.toRevisedEvent.bind(this);
    this.toEvent = this.toEvent.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  public async save(stream: string, event: E) {
    const descriptor = this.descriptor(stream, event);
    if (await this.insert(descriptor)) {
      publisher.project(event, {
        hydrated: false,
        outdated: false
      });
      return this.send(descriptor);
    }
  }

  public async add(descriptor: D) {
    const revision = this.toRevisedDescriptor(descriptor);
    if (await this.insert(descriptor)) {
      publisher.project(this.toEvent(revision), {
        hydrated: true,
        outdated: await this.outdated(descriptor)
      });
      return revision;
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Readers
   |--------------------------------------------------------------------------------
   */

  public async reduce<R extends Reducer<R["state"]>>(reducer: R, filter: JSONType): Promise<R["state"]> {
    return this.find(filter).then((events) => {
      return reducer.reduce(events);
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Parsers
   |--------------------------------------------------------------------------------
   */

  public toRevisedEvent(descriptor: D): E {
    return this.toEvent(this.toRevisedDescriptor(descriptor));
  }

  public toRevisedDescriptor(descriptor: D): D {
    return {
      ...descriptor,
      event: {
        type: descriptor.event.type,
        data: descriptor.event.data,
        meta: {
          ...descriptor.event.meta,
          revised: getLogicalTimestamp()
        }
      }
    };
  }

  public toEvent(descriptor: D): E {
    const event = this.events[descriptor.event.type];
    if (!event) {
      throw new EventNotFoundError(descriptor.event.type);
    }
    return event.from(descriptor);
  }

  /*
   |--------------------------------------------------------------------------------
   | Event Handlers
   |--------------------------------------------------------------------------------
   */

  public send(descriptor: D): D {
    this.emit("saved", descriptor);
    return descriptor;
  }

  /*
   |--------------------------------------------------------------------------------
   | Abstractions
   |--------------------------------------------------------------------------------
   */

  /**
   * Insert the given event descriptor in the local data stores.
   *
   * @example
   *
   * ```ts
   * const descriptor = store.descriptor(stream, event);
   * if (await store.insert(descriptor)) {
   *   return descriptor;
   * }
   * ```
   *
   * @remarks
   *
   * If the descriptor already exists this method should return a undefined which
   * will be treated as a duplicate response type and ignored by the store.
   */
  public abstract insert(descriptor: D): Promise<any>;

  public abstract find(filter: any): Promise<E[]>;

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
  public abstract outdated(descriptor: D): Promise<boolean>;

  /**
   * Return a descriptor object from the given streamId and event.
   */
  public abstract descriptor(stream: string, event: E): D;
}
