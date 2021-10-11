import { Timestamp } from "../Lib/Timestamp";
import { clock } from "./Clock";

/**
 * Get logical timestamp based on current time.
 *
 * @returns Timestamp with logical affix
 */
export function getLogicalTimestamp(): string {
  const ts = clock.now().toJSON();
  return `${ts.time}-${String(ts.logical).padStart(5, "0")}`;
}

/**
 * Get timestamp instance from provided logical id.
 *
 * @param ts - Logical timestamp to convert.
 *
 * @returns Timestamp
 */
export function getTimestamp(ts: string): Timestamp {
  const [time, logical] = ts.split("-");
  return new Timestamp(time, Number(logical));
}

/**
 * Get unix timestamp value from provided logical id.
 *
 * @param ts - Logical timestamp to convert.
 *
 * @returns Timestamp in unix formatted number
 */
export function getUnixTimestamp(ts: string): number {
  return getTimestamp(ts).time;
}
