import type { EventClass } from "../Types/Event";
import type { EventHandler } from "../Types/Reducer";
import type { Event } from "./Event";

export class Reducer<State> {
  public actions: Map<string, EventHandler<State, any>> = new Map();

  private readonly _state: State;

  constructor(initialState: State = {} as State) {
    this._state = Object.freeze<State>(initialState);
    this.set = this.set.bind(this);
    this.reduce = this.reduce.bind(this);
    this.fold = this.fold.bind(this);
  }

  public get state(): State {
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
  public set<E extends Event>(event: EventClass<E>, reducer: EventHandler<State, E>): this {
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
  public reduce<E extends Event>(events: E[]): State {
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
  public fold<E extends Event>(state: State, event: E): State {
    return this.actions.get(event.type)?.(state, event) || state;
  }
}
