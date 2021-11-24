import type { EventRecord } from "../Types/Event";
import type { NetworkStatus, NetworkType } from "../Types/Network";
import type { StreamNetworkHandler } from "../Types/Stream";

export abstract class EventNetwork {
  protected type: NetworkType = "client";
  protected status: NetworkStatus = "unavailable";

  /**
   * Check if the network is of type or in a specific state.
   */
  public is(value: NetworkType | NetworkStatus): boolean {
    return value === this.type || value === this.status;
  }

  /**
   * Check if the streams merkle root matches the network merkle root.
   */
  public abstract validate(streamId: string, tree: string): Promise<boolean>;

  /**
   * Push uncomitted descriptors to remote peer.
   */
  public abstract push(events: EventRecord[]): Promise<void>;

  /**
   * Pull events from the given stream. If a hash is provided we pull
   * the events greater than the given hash.
   */
  public abstract pull(streamId: string, commit?: string): Promise<EventRecord[]>;

  /**
   * Subscribe to new events for a given stream.
   */
  public abstract subscribe(streamId: string, handler: StreamNetworkHandler): void;

  /**
   * Unsubscribe from the given stream.
   */
  public abstract unsubscribe(streamId: string): void;
}
