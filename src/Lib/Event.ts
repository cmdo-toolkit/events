import type { EventClass, JSONEvent, JSONEventMeta } from "../Types/Event";
import type { JSONType } from "../Types/Shared";
import type { Descriptor } from "../Types/Store";
import { getEventData, getEventMeta } from "../Utils/Event";
import { getUnixTimestamp } from "../Utils/Timestamp";

export abstract class Event<D extends JSONType = JSONType, M extends JSONType = JSONType> {
  public readonly data: D;
  public readonly meta: JSONEventMeta<M>;

  constructor(data?: D, meta?: Partial<JSONEventMeta<M>>) {
    this.data = getEventData<D>(data);
    this.meta = getEventMeta(meta);
    Object.freeze(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  public static from<T extends Event>(this: EventClass<T>, descriptor: Descriptor): T {
    return new this(descriptor.event.data, descriptor.event.meta);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get type(): string {
    return (this as any).constructor.type;
  }

  public get revised() {
    return getUnixTimestamp(this.meta.revised);
  }

  public get created() {
    return getUnixTimestamp(this.meta.created);
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): JSONEvent<D, M> {
    return Object.freeze({
      type: this.type,
      data: this.data,
      meta: this.meta
    });
  }
}
