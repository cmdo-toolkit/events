import { Container, Token } from "cmdo-inverse";

import type { EventNetwork } from "./Services/EventNetwork";
import type { EventStore } from "./Services/EventStore";

export const container = new Container<{
  EventNetwork: Token<{ new (): EventNetwork }, EventNetwork>;
  EventStore: Token<{ new (): EventStore }, EventStore>;
}>();
