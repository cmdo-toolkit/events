import type { Event } from "../Lib/Event";

export type Options = {
  filter: Filter;
};

export type Filter = {
  allowHydratedEvents: boolean;
  allowOutdatedEvents: boolean;
};

export type State = {
  hydrated: boolean;
  outdated: boolean;
};

export type Message<E extends Event = Event> = {
  event: E;
  state: State;
};

export type Handler<E extends Event = Event> = (event: E) => Promise<void>;

export type Listeners = Record<string, Set<Projection> | undefined>;

export type Projection<E extends Event = Event> = (event: E, state: State) => Promise<void>;
