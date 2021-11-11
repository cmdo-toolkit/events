import type { Queue } from "../Lib/Queue";
import type { EventDescriptor } from "./Event";

export type StreamNetworkHandler = (descriptor: EventDescriptor) => void;

export type Streams = Record<string, StreamObserver>;

export type StreamObserver = {
  subscribers: number;
  queue: Queue<EventDescriptor>;
  onEvent: (descriptor: EventDescriptor) => void;
};
