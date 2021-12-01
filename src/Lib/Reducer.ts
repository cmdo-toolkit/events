import type { EventBase, EventRecord } from "../Types/Event";
import type { Reducer } from "../Types/Reducer";

export function createReducer<State, Event extends EventBase>(state: State = {} as State, reducer: Reducer<State, Event>) {
  return function (events: EventRecord<Event>[]): State {
    return events.reduce(reducer, { ...state });
  };
}
