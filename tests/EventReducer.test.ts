import { createEventRecord } from "../src/Lib/Event";
import { EventRecord } from "../src/Types/Event";
import { Event, foo } from "./mocks/Events";
import { reducer } from "./mocks/Reducer";

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

describe("EventReducer", () => {
  let mockEvents: EventRecord<Event>[];

  beforeAll(async () => {
    const fooCreated = createEventRecord(streamId, foo.created({ data: { title: "Bar" } }), { height: 0 });

    const memberAdded1 = createEventRecord(streamId, foo.memberAdded({ data: { name: "John Foo" } }), {
      height: 1,
      parent: fooCreated.commit
    });

    const memberAdded2 = createEventRecord(streamId, foo.memberAdded({ data: { name: "Jane Foo" } }), {
      height: 2,
      parent: memberAdded1.commit
    });

    mockEvents = [fooCreated, memberAdded1, memberAdded2];
  });

  it("should reduce a list of events into an expected state", () => {
    const state = reducer(mockEvents);
    expect(state).toEqual({
      title: "Bar",
      members: ["John Foo", "Jane Foo"]
    });
  });
});
