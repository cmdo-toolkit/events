import { event as projections } from "../Events/Projection";
import type { EventClass } from "../Types/Event";
import type { Filter, Handler, Options, State } from "../Types/Projection";
import type { Event } from "./Event";

export class Projection<E extends Event = Event> {
  public readonly type: string;
  public readonly handle: Handler<E>;
  public readonly filter: Filter;

  private listener?: () => void;

  constructor(event: EventClass<E>, handler: Handler<E>, options: Options) {
    this.type = event.type;
    this.handle = handler;
    this.filter = options.filter;
    this.start();
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Check if the incoming event state is compatible with the projection filter.
   */
  public isValid({ hydrated, outdated }: State) {
    if (this.filter.allowHydratedEvents === false && hydrated === true) {
      return false;
    }
    if (this.filter.allowOutdatedEvents === false && outdated === true) {
      return false;
    }
    return true;
  }

  /*
   |--------------------------------------------------------------------------------
   | Controllers
   |--------------------------------------------------------------------------------
   */

  /**
   * Start the projection by registering the projection handler against the
   * projections event emitter.
   */
  public start() {
    this.listener = projections.on(this.type, async (event, state) => {
      if (this.isValid(state)) {
        await this.handle(event as E);
      }
    });
  }

  /**
   * Stop the projection by removing the projection handler registered with the
   * projections event emitter.
   */
  public stop() {
    this.listener?.();
  }
}
