import type { EventDescriptor } from "../Types/Event";
import type { StreamNetworkHandler } from "../Types/Stream";

export interface EventNetwork {
  /**
   * Push uncomitted descriptors to remote peer.
   */
  push(descriptors: EventDescriptor[]): Promise<void>;

  /**
   * Pull events from the given stream. If a hash is provided we pull
   * the events greater than the given hash.
   */
  pull(stream: string, hash?: string): Promise<EventDescriptor[]>;

  /**
   * Subscribe to new events for a given stream.
   */
  subscribe(stream: string, handler: StreamNetworkHandler): void;

  /**
   * Unsubscribe from the given stream.
   */
  unsubscribe(stream: string): void;
}
