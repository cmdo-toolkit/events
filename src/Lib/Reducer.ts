import type { EventClass } from "../Types/Event";
import type { EventHandler } from "../Types/Reducer";
import type { JSONType } from "../Types/Shared";
import type { Event } from "./Event";

export class Reducer<S extends JSONType> {
  public actions: Map<string, EventHandler<S, any>> = new Map();

  private readonly _state: S;

  constructor(initialState: S = {} as S) {
    this._state = Object.freeze<S>(initialState);
    this.set = this.set.bind(this);
    this.reduce = this.reduce.bind(this);
    this.fold = this.fold.bind(this);
  }

  public get state(): S {
    return { ...this._state }; // ensure we get a mutable state object
  }

  /**
   * Register a new event handler with the reducer.
   *
   * @param event   - Event to reduce.
   * @param reducer - Reducer method to call.
   *
   * @returns EventReducer
   */
  public set<E extends Event>(event: EventClass<E>, reducer: EventHandler<S, E>): this {
    this.actions.set(event.type, reducer);
    return this;
  }

  /**
   * Reduce given events into a single immutable state.
   *
   * @param events - List of events to reduce.
   *
   * @returns State _(Immutable)_
   */
  public reduce<E extends Event>(events: E[]): S {
    return Object.freeze(events.reduce(this.fold, this.state));
  }

  /**
   * Fold given event onto the provided state.
   *
   * @param state - State to fold onto.
   * @param event - Event to fold..
   *
   * @returns State
   */
  public fold<E extends Event>(state: S, event: E): S {
    return this.actions.get(event.type)?.(state, event) || state;
  }
}
