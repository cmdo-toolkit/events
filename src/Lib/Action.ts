import type { ActionContext, ActionHandler } from "../Types/Action";
import { reduce, save, subscribe } from "./Stream";

export function action<Data>(handler: ActionHandler<Data>) {
  return async (data: Data, ctx?: ActionContext) => {
    await handler(data, {
      save,
      reduce,
      subscribe,
      ...(ctx ?? {})
    });
  };
}
