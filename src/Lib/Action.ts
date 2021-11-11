import type { ActionContext, ActionHandler } from "../Types/Action";
import { Stream } from "./Stream";

export function action<Data>(handler: ActionHandler<Data>) {
  return async (data: Data, ctx?: ActionContext) => {
    await handler(data, {
      streams: Stream,
      ...(ctx ?? {})
    });
  };
}
