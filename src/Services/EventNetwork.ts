import type { EventDescriptor } from "../Types/Event";
import type { StreamNetworkHandler } from "../Types/Stream";

export interface EventNetwork {
  emit(descriptor: EventDescriptor): Promise<void>;
  addListener(stream: string, handler: StreamNetworkHandler): void;
  removeListener(stream: string): void;
}
