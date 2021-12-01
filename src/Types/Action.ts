import type { EventStream } from "../Services/EventStream";

export type ActionHandler<Data> = (data: Data, ctx: ActionContext) => Promise<void>;

export interface ActionContext {
  reduce: EventStream["reduce"];
  append: EventStream["append"];
}
