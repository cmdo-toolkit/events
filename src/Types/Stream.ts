import type { Queue } from "../Lib/Queue";
import type { EventRecord } from "./Event";

export type StreamNetworkHandler = (event: EventRecord) => void;

export type Streams = Record<string, StreamObserver>;

export type StreamObserver = {
  /**
   * Number of subscribers observing changes to the stream. When this count
   * is 0 or less we can remove the observer from the streams tracker.
   */
  subscribers: number;

  /**
   * Streams event queue ensuring that we are processing incoming events in
   * strict sequence. This way we can properly validate each event without
   * worrying about other events being processesed within the stream while
   * performing certain determinations when processing data.
   */
  queue: Queue<EventRecord>;
};
