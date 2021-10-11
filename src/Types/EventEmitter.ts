export type ValidEventTypes = string | symbol | Record<string, unknown>;

export type EventNames<T extends ValidEventTypes> = T extends string | symbol ? T : keyof T;

export type EventListener<T extends ValidEventTypes, K extends EventNames<T>> = T extends string | symbol
  ? (...args: any[]) => void
  : (...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]) => void;

export type ArgumentMap<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => void ? Parameters<T[K]> : T[K] extends any[] ? T[K] : any[];
};
