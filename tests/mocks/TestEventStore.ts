import { EventStore } from "../../src/Services/EventStore";
import { EventRecord } from "../../src/Types/Event";
import type { Event } from "./Events";

export const records: EventRecord<Event>[] = [];

export class TestEventStore implements EventStore<Event> {
  public async insert<Record extends EventRecord<Event>>(record: Record) {
    records.push(record);
  }

  public async outdated(event: EventRecord<Event>) {
    for (const record of records) {
      if (record.type === event.type && record.streamId === event.streamId && record.date > event.date) {
        return true;
      }
    }
    return false;
  }
}
