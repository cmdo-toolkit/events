import { Event, Projection, projection } from "../src";
import { publisher } from "../src/Lib/Publisher";

const EVENT_TYPE = "MockEvent";

class MockEvent extends Event {
  public static readonly type = EVENT_TYPE;
}

const mockEvent = new MockEvent();

describe("Event Projector", () => {
  describe("when registered with .once", () => {
    let mockProjection: Projection;
    let handler: jest.Mock;

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.once(MockEvent, handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger when event is not hydrated and not outdated", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: false });
      expect(handler).toBeCalledTimes(1);
    });

    it("should ignore hydrated events", async () => {
      await publisher.project(mockEvent, { hydrated: true, outdated: false });
      expect(handler).toBeCalledTimes(0);
    });

    it("should ignore outdated events", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: true });
      expect(handler).toBeCalledTimes(0);
    });
  });

  describe("when registered with .on", () => {
    let mockProjection: Projection;
    let handler: jest.Mock;

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.on(MockEvent, handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger when event is not hydrated and not outdated", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: false });
      expect(handler).toBeCalledTimes(1);
    });

    it("should trigger when event is hydrated and not outdated", async () => {
      await publisher.project(mockEvent, { hydrated: true, outdated: false });
      expect(handler).toBeCalledTimes(1);
    });

    it("should ignore outdated events", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: true });
      expect(handler).toBeCalledTimes(0);
    });
  });

  describe("when registered with .all", () => {
    let mockProjection: Projection;
    let handler: jest.Mock;

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.all(MockEvent, handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger on all projections", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: false });
      await publisher.project(mockEvent, { hydrated: true, outdated: false });
      await publisher.project(mockEvent, { hydrated: false, outdated: true });
      await publisher.project(mockEvent, { hydrated: true, outdated: true });
      expect(handler).toBeCalledTimes(4);
    });
  });
});
