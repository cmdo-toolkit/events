import { createReducer } from "../src/Lib/Reducer";
import { foo, FooCreated, FooMemberAdded } from "./mocks/Events";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

const id = "xyz";

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

const mockEvents = [
  foo.created({ id, title: "Bar" }),
  foo.memberAdded({ id, name: "John Foo" }),
  foo.memberAdded({ id, name: "Jane Foo" })
];

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("EventReducer", () => {
  it("should reduce a list of events into an expected state", () => {
    const state = reduce(mockEvents);
    expect(state).toEqual({
      title: "Bar",
      members: ["John Foo", "Jane Foo"]
    });
  });
});
