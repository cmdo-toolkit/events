import type { append, reduce, subscribe } from "../Lib/Stream";

export type ActionHandler<Data> = (data: Data, ctx: ActionContext) => Promise<void>;

export interface ActionContext {
  append: typeof append;
  subscribe: typeof subscribe;
  reduce: typeof reduce;
}
