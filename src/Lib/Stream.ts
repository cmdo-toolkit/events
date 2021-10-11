import { event } from "../Events/Stream";
import type { Descriptor } from "../Types/Store";
import type { Status } from "../Types/Stream";
import { byCreated } from "../Utils/Sort";
import { EventEmitter } from "./EventEmitter";
import { Queue } from "./Queue";

export abstract class Stream extends EventEmitter<{
  status: (value: Status) => void;
}> {
  public readonly name: string;

  public status: Status;

  private readonly queue: Queue<Descriptor>;

  constructor(name: string) {
    super();

    this.name = name;

    this.status = "stopped";

    this.queue = new Queue(async (descriptor) => {
      await this.addEvent(descriptor);
      await this.setCheckpoint(descriptor.event.meta.revised);
    });

    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onEvent = this.onEvent.bind(this);

    event.addListener("connect", this.onConnect);
    event.addListener("disconnect", this.onDisconnect);
  }

  /*
   |--------------------------------------------------------------------------------
   | Static
   |--------------------------------------------------------------------------------
   */

  public static connect(): void {
    event.connect();
  }

  public static push(descriptor: Descriptor): void {
    event.push(descriptor);
  }

  public static disconnect(): void {
    event.disconnect();
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  public is(status: Status) {
    return this.status === status;
  }

  public async start(): Promise<this> {
    if (!this.is("stopped")) {
      return this;
    }

    this.setStatus("connecting");
    await this.connect();

    this.setStatus("hydrating");
    await this.hydrate();

    this.setStatus("started");
    event.addListener(this.name, this.onEvent);

    return this;
  }

  private async hydrate(): Promise<void> {
    const descriptors = (await this.getEvents()).sort(byCreated);
    if (descriptors.length > 0) {
      for (const descriptor of descriptors) {
        this.queue.push(descriptor);
      }
      await new Promise<void>((resolve, reject) => {
        this.queue.once("error", reject);
        this.queue.once("drained", resolve);
      });
      return this.hydrate();
    }
  }

  public stop(): this {
    event.removeListener(this.name, this.onEvent);
    return this.setStatus("stopped");
  }

  /*
   |--------------------------------------------------------------------------------
   | Event Handlers
   |--------------------------------------------------------------------------------
   */

  private onConnect(): this {
    if (this.is("stopped")) {
      this.start();
    }
    return this;
  }

  private setStatus(status: Status): this {
    if (!this.is(status)) {
      this.status = status;
      this.emit("status", status);
    }
    return this;
  }

  private onEvent(descriptor: Descriptor): this {
    this.queue.push(descriptor);
    return this;
  }

  private onDisconnect(): this {
    this.stop();
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Abstracted Utilities
   |--------------------------------------------------------------------------------
   */

  public abstract connect(): Promise<void>;

  public abstract addEvent(descriptor: Descriptor): Promise<void>;
  public abstract getEvents(): Promise<Descriptor[]>;

  public abstract setCheckpoint(value: string): Promise<void>;
  public abstract getCheckpoint(): Promise<string | undefined>;
}
