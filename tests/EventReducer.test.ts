import { Event, Reducer } from "../src";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

class FooCreated extends Event<{
  title: string;
}> {
  public static readonly type = "FooCreated" as const;
}

class FooMemberAdded extends Event<{
  name: string;
}> {
  public static readonly type = "FooMemberAdded" as const;
}

const mockReducer = new Reducer<{
  title: string;
  members: string[];
}>({
  title: "N/A",
  members: []
})
  .set(FooCreated, (state, { data }) => {
    return {
      ...state,
      title: data.title
    };
  })
  .set(FooMemberAdded, (state, { data }) => {
    return {
      ...state,
      members: [...state.members, data.name]
    };
  });

const mockEvents = [
  new FooCreated({ title: "Bar" }),
  new FooMemberAdded({ name: "John Foo" }),
  new FooMemberAdded({ name: "Jane Foo" })
];

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe.skip("EventReducer", () => {
  it("should reduce a list of events into an expected state", () => {
    const state = mockReducer.reduce(mockEvents);
    expect(state).toEqual({
      title: "Bar",
      members: ["John Foo", "Jane Foo"]
    });
  });
});
