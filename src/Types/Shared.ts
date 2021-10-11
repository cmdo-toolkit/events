export type JSONType<T = unknown> = Record<string | number, T>;

export type DeferredPromise = {
  resolve: any;
  reject: any;
};
