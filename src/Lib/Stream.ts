import { container } from "../Container";
import { StreamPrevHashError } from "../Errors/Stream";
import type { EventRecord } from "../Types/Event";
import type { ReducerDispatch } from "../Types/Reducer";
import { StreamObserver, Streams } from "../Types/Stream";
import { getMerkleRoot } from "../Utils/Merkle";
import { publisher } from "./Publisher";
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

export async function save<Record extends EventRecord>(
  record: Promise<Record>,
  store = container.get("EventStore"),
  network = container.get("EventNetwork")
) {
  const event = await record;

  await store.append(event);
  await publisher.project(event, { hydrated: false, outdated: await store.outdated(event) });

  network.push([event]);

  return event;
}

export async function append<Record extends EventRecord>(event: Record, store = container.get("EventStore")) {
  const hash = await getLatestHash(event.streamId);
  if (event.parent !== hash) {
    throw new StreamPrevHashError(event.streamId, hash);
  }

  await store.append(event);
  await publisher.project(event, { hydrated: true, outdated: await store.outdated(event) });

  return event;
}

/**
 * When performing a rebase the intent is to pull all new events form the connected
 * event store network which represents the single source of global truth and
 * replay all the local events which has yet to be pushed to the network back onto
 * itself with new hash and height values.
 *
 * @param id     - Entity, Aggregate, Stream ID to rebase.
 * @param commit - Fetch all unknown events after the given commit hash.
 */
export async function rebase(id: string, commit: string, network = container.get("EventNetwork")) {
  // ...
}

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
export function subscribe(id: string): () => void {
  const observer = getObserver(id);
  observer.subscribers += 1;
  return () => unsubscribe(id);
}

/**
 * When reducing a stream we want to ensure that we always have the latest list
 * of events to the best of our abilities. If the reducer is running on a client
 * and the networ is currently available, we do a stream sync operation before
 * getting the local event stream.
 */
export async function reduce<Dispatch extends ReducerDispatch<any, any>>(
  streamId: string,
  dispatch: Dispatch,
  store = container.get("EventStore"),
  network = container.get("EventNetwork")
): Promise<ReturnType<Dispatch> | undefined> {
  if (network.is("available")) {
    const isValid = await network.validate(streamId, await getStreamHash(streamId));
    if (!isValid) {
      await rebase(streamId, "xyz");
    }
  }
  return store.getStreamEvents(streamId).then((events) => {
    if (events.length > 0) {
      return dispatch(events);
    }
  });
}

async function getStreamHash(streamId: string, store = container.get("EventStore")): Promise<string> {
  return store.getStreamEvents(streamId).then((events) => {
    if (events.length > 0) {
      return getMerkleRoot(events.map((event) => event.commit));
    }
    return "none";
  });
}

async function getLatestHash(streamId: string, store = container.get("EventStore")): Promise<string | undefined> {
  const event = await store.getLastEvent("stream", streamId);
  if (event) {
    return event.commit;
  }
}

function unsubscribe(id: string, network = container.get("EventNetwork")) {
  const observer = getObserver(id);
  observer.subscribers -= 1;
  if (observer.subscribers < 1) {
    network.unsubscribe(id);
    delete streams[id];
  }
}

function getObserver(id: string, network = container.get("EventNetwork")): StreamObserver {
  if (streams[id]) {
    return streams[id];
  }
  streams[id] = {
    subscribers: 0,
    queue: new Queue<EventRecord>(append)
  };
  network.subscribe(id, streams[id].queue.push);
  return streams[id];
}
