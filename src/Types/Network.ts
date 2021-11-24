export type NetworkType = "server" | "client";

export type NetworkStatus = "available" | "unavailable";

export type NetworkTarget = {
  /**
   * Network unique identifier based on the event stores database instance. For
   * example, a server, browser, mobile or desktop app would have its own
   * network target identifier. If the local database is wiped a new target
   * identifier would have to be created for that device.
   */
  id: string;

  streams: Record<string, NetworkStream>;
};

export type NetworkStream = {
  /**
   * Last known commit hash retrieved from the remote stream.
   */
  commit: string;

  /**
   * Merkle hash for the entire remote stream.
   */
  merkle: string;
};
