import { Container, Token } from "cmdo-inverse";

import type { EventStore } from "./Services/EventStore";
import type { EventStream } from "./Services/EventStream";

export const container = new Container<{
  EventStore: Token<{ new (): EventStore }, EventStore>;
  EventStream: Token<{ new (): EventStream }, EventStream>;
}>();
