import { FILTER_ALL, FILTER_CONTINUOUS, FILTER_ONCE } from "../Constants/Projection";
import type { EventClass } from "../Types/Event";
import type { Handler } from "../Types/Projection";
import type { Event } from "./Event";
import { Projection } from "./Projection";

export const project = {
  /**
   * Create a single run projection handler.
   *
   * @remarks
   *
   * This method tells the projection that an event is only ever processed when
   * the event is originating directly from the local event store. A useful
   * pattern for when you want the event handler to submit data to a third
   * party service such as sending an email or submitting third party orders.
   *
   * We dissallow `hydrate` and `outdated` as these events represents events
   * that has already been processed.
   */
  once<E extends Event = Event>(event: EventClass<E>, handler: Handler<E>) {
    return new Projection(event, handler, { filter: FILTER_ONCE });
  },

  /**
   * Create a continuous projection handler.
   *
   * @remarks
   *
   * This method tells the projection to allow events directly from the event
   * store as well as events coming through hydration via sync, manual or
   * automatic stream rehydration operations. This is the default pattern
   * used for most events. This is where you usually project the latest data
   * to your read side models and data stores.
   *
   * We allow `hydrate` as they serve to keep the read side up to date with
   * the latest events. We dissallow `outdated` as we do not want the latest
   * data to be overriden by outdated ones.
   *
   * NOTE! The nature of this pattern means that outdated events are never
   * run by this projection. Make sure to handle `outdated` events if you
   * have processing requirements that needs to know about every unknown
   * events that has occured in the event stream.
   */
  on<E extends Event = Event>(event: EventClass<E>, handler: Handler<E>) {
    return new Projection(event, handler, { filter: FILTER_CONTINUOUS });
  },

  /**
   * Create a catch all projection handler.
   *
   * @remarks
   *
   * This method is a catch all for events that does not fall under the
   * stricter defintitons of once and on patterns. This is a good place
   * to deal with data that does not depend on a strict order of events.
   */
  all<E extends Event = Event>(event: EventClass<E>, handler: Handler<E>) {
    return new Projection(event, handler, { filter: FILTER_ALL });
  }
};
