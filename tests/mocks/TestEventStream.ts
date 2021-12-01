import { container } from "../../src/Container";
import { createEventRecord } from "../../src/Lib/Event";
import { EventStream } from "../../src/Services/EventStream";
import { EventBase } from "../../src/Types/Event";
import { ReduceHandler } from "../../src/Types/Reducer";
import type { Event } from "./Events";
import { records } from "./TestEventStore";

export class TestEventStream implements EventStream<Event> {
  public async append<Event extends EventBase>(streamId: string, event: Event, store = container.get("EventStore")) {
    const parent = await this.getLastEvent(streamId);
    const record = createEventRecord(streamId, event, {
      height: (parent?.height === undefined ? -1 : parent.height) + 1,
      parent: parent?.commit
    });
    await store.insert(record);
  }

  public async reduce<Reduce extends ReduceHandler>(streamId: string, reduce: Reduce) {
    const events = await this.getEvents(streamId);
    if (events.length) {
      return reduce(events) as ReturnType<Reduce>;
    }
  }

  public async getEvents(streamId: string, commit?: string, direction?: 1 | -1) {
    const events = records.filter((event) => event.streamId === streamId);
    if (commit) {
      const index = records.findIndex((event) => event.commit === commit);
      if (index !== -1) {
        if (direction === 1) {
          return events.slice(-index);
        }
        return events.slice(index);
      }
    }
    return events;
  }

  public async getLastEvent(streamId: string) {
    const events = await this.getEvents(streamId);
    return events[events.length - 1];
  }
}
