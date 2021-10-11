import { Container, Token } from "cmdo-inverse";

import type { Store } from "./Lib/Store";

export const container = new Container<{
  Store: Token<{ new (): Store }, Store>;
}>();
