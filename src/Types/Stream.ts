import type { Queue } from "../Lib/Queue";
import type { EventRecord } from "./Event";

export type StreamNetworkHandler = (descriptor: EventRecord) => void;

export type Streams = Record<string, StreamObserver>;

export type StreamObserver = {
  subscribers: number;
  queue: Queue<EventRecord>;
  onEvent: (event: EventRecord) => void;
};
