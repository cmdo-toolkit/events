import { EventRecord } from "../Types/Event";
import { Dispatch, Reducer } from "../Types/Reducer";

export function createReducer<State, Event extends EventRecord<Event["type"]>>(
  state: State = {} as State,
  reducer: Reducer<State, Event>
): Dispatch<State, Event> {
  return function (events: Event[]): State {
    return events.reduce((state, event) => reducer(state, event), { ...state });
  };
}
