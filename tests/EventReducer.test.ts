import { container } from "../src/Container";
import { createReducer } from "../src/Lib/Reducer";
import { foo, FooCreated, FooMemberAdded } from "./mocks/Events";
import { TestEventStore } from "./mocks/TestEventStore";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

const streamId = "xyz";

const reduce = createReducer<
  {
    title: string;
    members: string[];
  },
  FooCreated | FooMemberAdded
>(
  {
    title: "",
    members: []
  },
  (state, event) => {
    switch (event.type) {
      case "FooCreated": {
        return {
          ...state,
          title: event.data.title
        };
      }
      case "FooMemberAdded": {
        return {
          ...state,
          members: [...state.members, event.data.name]
        };
      }
    }
  }
);

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("EventReducer", () => {
  let mockEvents: [Readonly<FooCreated>, Readonly<FooMemberAdded>, Readonly<FooMemberAdded>];

  beforeAll(async () => {
    container.set("EventStore", new TestEventStore());
    mockEvents = await Promise.all([
      foo.created(streamId, { title: "Bar" }),
      foo.memberAdded(streamId, { name: "John Foo" }),
      foo.memberAdded(streamId, { name: "Jane Foo" })
    ]);
  });

  it("should reduce a list of events into an expected state", () => {
    const state = reduce(mockEvents);
    expect(state).toEqual({
      title: "Bar",
      members: ["John Foo", "Jane Foo"]
    });
  });
});
