import { EventStore } from "../../src/Services/EventStore";
import { EventRecord } from "../../src/Types/Event";

export class TestEventStore implements EventStore {
  public readonly events: EventRecord[] = [];

  public async append(event: EventRecord): Promise<EventRecord> {
    this.events.push(event);
    return event;
  }

  public async getAllEvents(height?: number, direction?: 1 | -1): Promise<EventRecord[]> {
    const events = this.events;
    if (height) {
      const index = this.events.findIndex((event) => event.height === height);
      if (index !== -1) {
        if (direction === 1) {
          return events.slice(-index);
        }
        return events.slice(index);
      }
    }
    return events;
  }

  public async getStreamEvents(streamId: string, commit?: string, direction?: 1 | -1): Promise<EventRecord[]> {
    const events = this.events.filter((event) => event.streamId === streamId);
    if (commit) {
      const index = this.events.findIndex((event) => event.commit === commit);
      if (index !== -1) {
        if (direction === 1) {
          return events.slice(-index);
        }
        return events.slice(index);
      }
    }
    return events;
  }

  public async getFilteredEvents(filter: Record<string, unknown>): Promise<EventRecord[]> {
    throw new Error("Method append not implemented.");
  }

  public async getFirstEvent(scope: "all"): Promise<EventRecord | undefined>;
  public async getFirstEvent(scope: "stream", streamId: string): Promise<EventRecord | undefined>;
  public async getFirstEvent(scope: "all" | "stream", streamId?: string): Promise<EventRecord | undefined> {
    switch (scope) {
      case "all": {
        return this.events[0];
      }
      case "stream": {
        return (await this.getStreamEvents(streamId as string))[0];
      }
    }
  }

  public async getLastEvent(scope: "all"): Promise<EventRecord | undefined>;
  public async getLastEvent(scope: "stream", streamId: string): Promise<EventRecord | undefined>;
  public async getLastEvent(scope: "all" | "stream", streamId?: string): Promise<EventRecord | undefined> {
    switch (scope) {
      case "all": {
        return this.events[this.events.length - 1];
      }
      case "stream": {
        const events = await this.getStreamEvents(streamId as string);
        return events[events.length - 1];
      }
    }
  }

  public async outdated(event: EventRecord): Promise<boolean> {
    for (const record of this.events) {
      if (record.type === event.type && record.streamId === event.streamId && record.date > event.date) {
        return true;
      }
    }
    return false;
  }
}
