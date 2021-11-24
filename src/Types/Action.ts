import type { reduce, save, subscribe } from "../Lib/Stream";

export type ActionHandler<Data> = (data: Data, ctx: ActionContext) => Promise<void>;

export interface ActionContext {
  save: typeof save;
  subscribe: typeof subscribe;
  reduce: typeof reduce;
}
