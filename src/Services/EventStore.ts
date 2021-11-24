import type { EventRecord } from "../Types/Event";

export interface EventStore {
  append(event: EventRecord): Promise<EventRecord>;

  getAllEvents(height?: number, direction?: -1 | 1): Promise<EventRecord[]>;
  getStreamEvents(streamId: string, commit?: string, direction?: -1 | 1): Promise<EventRecord[]>;
  getFilteredEvents(filter: Record<string, unknown>): Promise<EventRecord[]>;

  getFirstEvent(scope: "all"): Promise<EventRecord | undefined | null>;
  getFirstEvent(scope: "stream", streamId: string): Promise<EventRecord | undefined | null>;
  getFirstEvent(scope: "all" | "stream", streamId?: string): Promise<EventRecord | undefined | null>;

  getLastEvent(scope: "all"): Promise<EventRecord | undefined | null>;
  getLastEvent(scope: "stream", streamId: string): Promise<EventRecord | undefined | null>;
  getLastEvent(scope: "all" | "stream", streamId?: string): Promise<EventRecord | undefined | null>;

  outdated(event: EventRecord): Promise<boolean>;
}
