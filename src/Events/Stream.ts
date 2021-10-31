import { EventEmitter } from "../Lib/EventEmitter";
import type { Descriptor } from "../Types/Store";

export const event = new (class StreamEventEmitter extends EventEmitter {
  public connect() {
    this.emit("connect");
  }
  public push(descriptor: Descriptor) {
    for (const stream of descriptor.streams) {
      this.emit(stream, descriptor);
    }
  }
  public disconnect() {
    this.emit("disconnect");
  }
})();
