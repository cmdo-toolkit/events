import { container } from "../Container";
import { StreamPrevHashError } from "../Errors/Stream";
import type { EventRecord } from "../Types/Event";
import type { Dispatch } from "../Types/Reducer";
import { StreamObserver, Streams } from "../Types/Stream";
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

export async function append<Record extends EventRecord>(
  event: Record,
  hydrated = false,
  store = container.get("EventStore"),
  network = container.get("EventNetwork")
) {
  const hash = await getLatestHash(event.data.id);
  if (hydrated === true) {
    if (event.hash.parent !== hash) {
      throw new StreamPrevHashError(event.data.id, hash);
    }
  } else {
    event.hash.parent = hash;
  }

  await store.append(event);
  await publisher.project(event, { hydrated, outdated: await store.outdated(event) });

  if (hydrated === false) {
    network.push([event]);
  }

  return event;
}

export function subscribe(id: string): () => void {
  const observer = getObserver(id);
  observer.subscribers += 1;
  return () => unsubscribe(id);
}

export async function reduce<D extends Dispatch<any, any>>(
  id: string,
  dispatch: D,
  store = container.get("EventStore")
): Promise<ReturnType<D> | undefined> {
  return store.getByStream(id).then((events) => {
    if (events.length > 0) {
      return dispatch(events);
    }
  });
}

async function getLatestHash(id: string, store = container.get("EventStore")): Promise<string> {
  const event = await store.getLastEventByStream(id);
  if (event) {
    return event.hash.commit;
  }
  return "genesis";
}

function unsubscribe(id: string, network = container.get("EventNetwork")) {
  const observer = getObserver(id);
  observer.subscribers -= 1;
  if (observer.subscribers === 0) {
    network.unsubscribe(id);
    delete streams[id];
  }
}

function getObserver(id: string, network = container.get("EventNetwork")): StreamObserver {
  if (streams[id]) {
    return streams[id];
  }
  streams[id] = {
    queue: new Queue<EventRecord>(append),
    subscribers: 0,
    onEvent(event: EventRecord) {
      this.queue.push(event);
    }
  };
  network.subscribe(id, streams[id].onEvent);
  return streams[id];
}
