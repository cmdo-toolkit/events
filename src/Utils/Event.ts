import * as CryptoJS from "crypto-js";

import { container } from "../Container";
import type { EventRecord } from "../Types/Event";
import { getLogicalTimestamp } from "../Utils/Timestamp";

export function getEventFactory<Record extends EventRecord>(type: Record["type"]) {
  return async function (streamId: string, data: Record["data"] = {}, meta: Record["meta"] = {}) {
    const { height, parent } = await getEventAssignments(streamId);
    const event = {
      streamId,
      type,
      data,
      meta,
      date: getLogicalTimestamp(),
      author: "system",
      height,
      parent
    } as Omit<Record, "commit">;
    return Object.freeze({ ...event, commit: getCommitHash(event) }) as Readonly<Record>;
  };
}

async function getEventAssignments(streamId: string, store = container.get("EventStore")) {
  const event = await store.getLastEvent("stream", streamId);
  console.log("last event", event);
  return {
    height: (event?.height === undefined ? -1 : event.height) + 1,
    parent: event?.commit
  };
}

function getCommitHash<Record extends EventRecord>(event: Omit<Record, "commit">): string {
  return CryptoJS.SHA256(JSON.stringify(event)).toString();
}
