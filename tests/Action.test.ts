import { container } from "../src/Container";
import { createAction } from "../src/Lib/Action";
import { foo } from "./mocks/Events";
import { reducer } from "./mocks/Reducer";
import { TestEventStore } from "./mocks/TestEventStore";
import { TestEventStream } from "./mocks/TestEventStream";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

const streamId = "xyz";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Action", () => {
  const create = createAction<{ title: string }>(async function ({ title }, { reduce, append }) {
    const state = await reduce(streamId, reducer);
    if (state) {
      throw new Error("Already exists");
    }
    await append(streamId, foo.created({ data: { title } }));
  });

  beforeAll(() => {
    container.set("EventStore", new TestEventStore()).set("EventStream", new TestEventStream());
  });

  it("should successfully execute an action", async () => {
    await create({ title: "Hello" });
  });
});
