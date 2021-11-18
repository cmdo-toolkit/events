import type { ActionContext, ActionHandler } from "../Types/Action";
import { append, reduce, subscribe } from "./Stream";

export function action<Data>(handler: ActionHandler<Data>) {
  return async (data: Data, ctx?: ActionContext) => {
    await handler(data, {
      append,
      reduce,
      subscribe,
      ...(ctx ?? {})
    });
  };
}
