import type { EventRecord } from "./Event";

export type Reducer<State, Event extends EventRecord<Event["type"]>> = (state: State, event: Event) => State;

export type Dispatch<State, Event extends EventRecord<Event["type"]>> = (events: Event[]) => State;
