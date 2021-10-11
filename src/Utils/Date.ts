import { getUnixTimestamp } from "./Timestamp";

/**
 * Get a date object from given event id.
 *
 * @param id - An events localId or originId.
 *
 * @returns Date
 */
export function getDate(id: string): Date {
  return new Date(getUnixTimestamp(id));
}

/**
 * Get current time as a unix timestamp.
 *
 * @returns Unix timestamp
 */
export function getTime(): number {
  return Date.now();
}
