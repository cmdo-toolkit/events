import type { Timestamp } from "../Lib/Timestamp";
import { getDate } from "./Date";
import { getLogicalTimestamp } from "./Timestamp";
import { getTimestamp } from "./Timestamp";

export async function runTimestampTest(i = 10, minDelay = 0, maxDelay = 1000) {
  let timestamps: { count: number; id: string; ts: Timestamp; dt: Date }[] = [];

  let y = 0;
  while (i--) {
    await new Promise<void>((resolve) => {
      const timeout = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
      setTimeout(() => {
        const id = getLogicalTimestamp();
        const ts = getTimestamp(id);
        const dt = getDate(id);

        timestamps.push({ count: y++, id, ts, dt });

        console.log("Timestamp created after", timeout, "ms at position", y);

        resolve();
      }, timeout);
    });
  }

  timestamps = timestamps.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    }
    return -1;
  });

  let validated = true;
  let x = 0;
  for (const timestamp of timestamps) {
    if (timestamp.count !== x) {
      validated = false;
      console.log(timestamp.count, "!==", x);
      break;
    }
    x++;
  }

  return { validated, timestamps };
}
