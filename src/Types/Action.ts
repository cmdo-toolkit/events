import type { Stream } from "../Lib/Stream";

export type ActionHandler<Data> = (data: Data, ctx: ActionContext) => Promise<void>;

export interface ActionContext {
  streams: typeof Stream;
}
