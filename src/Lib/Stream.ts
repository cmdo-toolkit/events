import { container } from "../Container";
import type { EventRecord } from "../Types/Event";
import { StreamObserver, Streams } from "../Types/Stream";
import { Queue } from "./Queue";

/*
 |--------------------------------------------------------------------------------
 | Streams
 |--------------------------------------------------------------------------------
 */

const streams: Streams = {};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/*
export async function save<E extends EventBase>(streamId: string, event: E, stream = container.get("EventStream")) {
  // await store.append(event);
  // await publisher.project(event, { hydrated: false, outdated: await store.outdated(event) });
  // network.push([event]);
  // return event;

  return stream.append(streamId, event);
}

export async function append<Record extends EventRecord>(record: Record, store = container.get("EventStore")) {
  // const hash = await getLatestHash(record.streamId);
  // if (record.parent !== hash) {
  //   throw new StreamPrevHashError(record.streamId, hash);
  // }

  // await store.insert(record);
  // await publisher.project(event, { hydrated: true, outdated: await store.outdated(event) });

  return store.insert(record);
}
*/

/**
 * When reducing a stream we want to ensure that we always have the latest list
 * of events to the best of our abilities. If the reducer is running on a client
 * and the networ is currently available, we do a stream sync operation before
 * getting the local event stream.
 */
// export async function reduce(
//   streamId: string,
//   dispatch: ReturnType<typeof createReducer>,
//   stream = container.get("EventStream"),
//   network = container.get("EventNetwork")
// ): Promise<ReturnType<typeof createReducer> | undefined> {
//   if (network.is("available")) {
//     const isValid = await network.validate(streamId, await getStreamHash(streamId));
//     if (!isValid) {
//       await rebase(streamId, "xyz");
//     }
//   }
//   return stream.getEvents(streamId).then((events) => {
//     if (events.length > 0) {
//       return dispatch(events);
//     }
//   });
// }

// async function getStreamHash(streamId: string, stream = container.get("EventStream")): Promise<string> {
//   return stream.getEvents(streamId).then((events) => {
//     if (events.length > 0) {
//       return getMerkleRoot(events.map((event) => event.commit));
//     }
//     return "none";
//   });
// }

// async function getLatestHash(streamId: string, stream = container.get("EventStream")): Promise<string | undefined> {
//   const event = await stream.getLastEvent(streamId);
//   if (event) {
//     return event.commit;
//   }
// }

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

function unsubscribe(streamId: string, network = container.get("EventNetwork")) {
  const observer = getObserver(streamId);
  observer.subscribers -= 1;
  if (observer.subscribers < 1) {
    network.unsubscribe(streamId);
    delete streams[streamId];
  }
}

function getObserver(streamId: string, store = container.get("EventStore"), network = container.get("EventNetwork")): StreamObserver {
  if (streams[streamId]) {
    return streams[streamId];
  }
  streams[streamId] = {
    subscribers: 0,
    queue: new Queue<EventRecord>(store.insert)
  };
  network.subscribe(streamId, streams[streamId].queue.push);
  return streams[streamId];
}
