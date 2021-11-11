import { container } from "../Container";
import { StreamNotFoundError, StreamPrevHashError } from "../Errors/Stream";
import { EventDescriptor } from "../Types/Event";
import { StreamObserver, Streams } from "../Types/Stream";
import { Event } from "./Event";
import { publisher } from "./Publisher";
import { Queue } from "./Queue";
import { Reducer } from "./Reducer";

/*
 |--------------------------------------------------------------------------------
 | Streams
 |--------------------------------------------------------------------------------
 */

const streams: Streams = {};

/*
 |--------------------------------------------------------------------------------
 | Stream
 |--------------------------------------------------------------------------------
 */

export class Stream {
  public readonly name: string;

  public readonly network = container.get("EventNetwork");
  public readonly store = container.get("EventStore");

  constructor(name: string) {
    this.name = name;
  }

  /*
   |--------------------------------------------------------------------------------
   | Static Helpers
   |--------------------------------------------------------------------------------
   */

  public static async save(name: string, event: Event): Promise<EventDescriptor> {
    return this.get(name).save(event);
  }

  public static async append(descriptor: EventDescriptor, store = container.get("EventStore")): Promise<EventDescriptor> {
    const record = await store.getLastEventByStream(descriptor.stream);
    if (!record) {
      throw new StreamNotFoundError(descriptor.stream);
    }
    if (record.event.hash !== descriptor.prevHash) {
      throw new StreamPrevHashError(descriptor.stream, record.event.hash, descriptor.prevHash);
    }
    await store.append(descriptor);
    await publisher.project(store.toEvent(descriptor), {
      hydrated: true,
      outdated: await store.outdated(descriptor)
    });
    return descriptor;
  }

  public static async reduce<R extends Reducer<R["state"]>>(reducer: R, name: string): Promise<R["state"] | undefined> {
    return this.get(name).reduce(reducer);
  }

  public static get(name: string): Stream {
    return new Stream(name);
  }

  /*
   |--------------------------------------------------------------------------------
   | Stream Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Attempts to save the provided event to the local stream and on success
   * sends event forwards for projection.
   */
  public async save(event: Event): Promise<EventDescriptor> {
    if (event.genesis) {
      const descriptor = await this.store.append(event.toDescriptor(this.name));
      await publisher.project(event, {
        hydrated: true,
        outdated: false
      });
      return descriptor;
    }
    const lastDescriptor = await this.store.getLastEventByStream(this.name);
    if (!lastDescriptor) {
      throw new StreamNotFoundError(this.name);
    }
    const descriptor = await this.store.append(event.toDescriptor(this.name, lastDescriptor.event.hash));
    await publisher.project(event, {
      hydrated: true,
      outdated: false
    });
    return descriptor;
  }

  public async reduce<R extends Reducer<R["state"]>>(reducer: R): Promise<R["state"] | undefined> {
    return this.store.getByStream(this.name).then((descriptors) => {
      if (descriptors.length > 0) {
        return reducer.reduce(descriptors.map(this.store.toEvent));
      }
    });
  }

  /**
   * Creates a listener for events propogating through the network.
   */
  public subscribe() {
    const observer = this.observer();
    observer.subscribers += 1;
    return this.unsubscribe.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Observation Utilities
   |--------------------------------------------------------------------------------
   */

  private unsubscribe() {
    const observer = this.observer();
    observer.subscribers -= 1;
    if (observer.subscribers === 0) {
      this.network.removeListener(this.name);
      delete streams[this.name];
    }
  }

  private observer(): StreamObserver {
    if (streams[this.name]) {
      return streams[this.name];
    }
    streams[this.name] = {
      queue: new Queue<EventDescriptor>(Stream.append),
      subscribers: 0,
      onEvent(descriptor: EventDescriptor) {
        this.queue.push(descriptor);
      }
    };
    this.network.addListener(this.name, streams[this.name].onEvent);
    return streams[this.name];
  }
}
