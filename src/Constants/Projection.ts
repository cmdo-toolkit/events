import type { Filter } from "../Types/Projection";

export const FILTER_ONCE = Object.freeze<Filter>({
  allowHydratedEvents: false,
  allowOutdatedEvents: false
});

export const FILTER_CONTINUOUS = Object.freeze<Filter>({
  allowHydratedEvents: true,
  allowOutdatedEvents: false
});

export const FILTER_ALL = Object.freeze<Filter>({
  allowHydratedEvents: true,
  allowOutdatedEvents: true
});
