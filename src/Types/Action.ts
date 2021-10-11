import { Store } from "../Lib/Store";

export type ActionHandler<Data> = (data: Data, ctx: ActionContext) => Promise<void>;

export interface ActionContext {
  store: Store;
}
