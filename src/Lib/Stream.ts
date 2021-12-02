import { container } from "../Container";
import type { EventRecord } from "../Types/Event";
import { StreamObserver, Streams } from "../Types/Stream";
import { Queue } from "./Queue";

const streams: Streams = {};

/**
 * When subscribing we keep track of all instances that are currently observing
 * the provided id. This way we can ensure that we can keep the observer alive
 * until there are no longer any active subscribers.
 *
 * This approach allows us to only have a single observer for multiple
 * subscribers removing the issue of having multiple subscribers attempting to
 * update the event store with the same event.
 *
 * @param id - Entity, Aggregate, Stream ID to subscribe to.
 *
 * @returns Unsubscribe function to call when destroying the subscription.
 */
export function subscribe(streamId: string): () => void {
  const observer = getObserver(streamId);
  observer.subscribers += 1;
  return () => unsubscribe(streamId);
}

function unsubscribe(streamId: string, stream = container.get("EventStream")) {
  const observer = getObserver(streamId);
  observer.subscribers -= 1;
  if (observer.subscribers < 1) {
    stream.unsubscribe(streamId);
    delete streams[streamId];
  }
}

function getObserver(streamId: string, store = container.get("EventStore"), stream = container.get("EventStream")): StreamObserver {
  if (streams[streamId]) {
    return streams[streamId];
  }
  streams[streamId] = {
    subscribers: 0,
    queue: new Queue<EventRecord>(store.insert)
  };
  stream.subscribe(streamId, streams[streamId].queue.push);
  return streams[streamId];
}
