import { container } from "../Container";
import type { ActionContext, ActionHandler } from "../Types/Action";

export function createAction<Data>(handler: ActionHandler<Data>) {
  return async (data: Data, ctx?: ActionContext, stream = container.get("EventStream")) => {
    await handler(data, {
      append: stream.append.bind(stream),
      reduce: stream.reduce.bind(stream),
      ...(ctx ?? {})
    });
  };
}
