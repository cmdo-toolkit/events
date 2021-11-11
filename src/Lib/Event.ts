import * as CryptoJS from "crypto-js";

import type { EventClass, EventDescriptor, EventMeta } from "../Types/Event";
import type { JSONType } from "../Types/Shared";
import { getEventData, getEventMeta } from "../Utils/Event";
import { getUnixTimestamp } from "../Utils/Timestamp";

export abstract class Event<EventData extends JSONType = JSONType> {
  public readonly data: EventData;
  public readonly meta: EventMeta;

  constructor(data?: EventData, meta?: Partial<EventMeta>) {
    this.data = getEventData<EventData>(data);
    this.meta = getEventMeta(meta);
    Object.freeze(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  public static from<T extends Event>(this: EventClass<T>, descriptor: EventDescriptor): T {
    return new this(descriptor.event.data, descriptor.event.meta);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get genesis(): boolean {
    return (this as any).constructor.genesis === true;
  }

  public get type(): string {
    return (this as any).constructor.type;
  }

  public get created() {
    return getUnixTimestamp(this.meta.created);
  }

  public get hash() {
    return CryptoJS.SHA256(
      JSON.stringify({
        type: this.type,
        data: this.data,
        meta: this.meta
      })
    ).toString();
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toDescriptor(stream: string, prevHash?: string): EventDescriptor {
    if (!this.genesis && !prevHash) {
      throw new Error("Event Violation: Non genesis event has no parent hash provided");
    }
    return {
      stream,
      event: this.toJSON(),
      prevHash
    };
  }

  public toJSON() {
    return {
      type: this.type,
      data: this.data,
      meta: this.meta,
      hash: this.hash
    };
  }
}
