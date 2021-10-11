import { EventEmitter } from "../Lib/EventEmitter";
import type { Descriptor } from "../Types/Store";

export const event = new (class StreamEventEmitter extends EventEmitter {
  public connect() {
    this.emit("connect");
  }
  public push(descriptor: Descriptor) {
    this.emit(descriptor.stream, descriptor);
  }
  public disconnect() {
    this.emit("disconnect");
  }
})();
