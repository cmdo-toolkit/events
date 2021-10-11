import type { Event } from "../Lib/Event";
import { Queue } from "../Lib/Queue";
import type { Listeners, Message, Projection, State } from "../Types/Projection";

export const event = new (class ProjectionEmitter {
  public listeners: Listeners = {};

  public queue: Queue<Message>;

  constructor() {
    this.project = this.project.bind(this);
    this.queue = new Queue(async ({ event, state }) => {
      return Promise.all(Array.from(this.listeners[event.type] || []).map((fn) => fn(event, state)));
    });
  }

  public async project<E extends Event = Event>(event: E, state: State) {
    return new Promise<boolean>((resolve) => {
      this.queue.push({ event, state }, resolve);
    });
  }

  public on(type: string, fn: Projection) {
    const listeners = this.listeners[type];
    if (listeners) {
      listeners.add(fn);
    } else {
      this.listeners[type] = new Set([fn]);
    }
    return () => {
      this.off(type, fn);
    };
  }

  public off(type: string, fn: Projection) {
    this.listeners[type]?.delete(fn);
  }
})();
