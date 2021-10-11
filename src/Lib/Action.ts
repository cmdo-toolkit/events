import { container } from "../Container";
import type { ActionContext, ActionHandler } from "../Types/Action";

export function action<Data>(handler: ActionHandler<Data>) {
  return async (data: Data, ctx?: ActionContext) => {
    await handler(data, {
      store: container.get("Store"),
      ...(ctx ?? {})
    });
  };
}
