import type { EventRecord } from "../../src/Types/Event";
import { getEventFactory } from "../../src/Utils/Event";

export type FooCreated = EventRecord<"FooCreated", { title: string }>;
export type FooMemberAdded = EventRecord<"FooMemberAdded", { name: string }>;

export const foo = {
  created: getEventFactory<FooCreated>("FooCreated"),
  memberAdded: getEventFactory<FooMemberAdded>("FooMemberAdded")
};
