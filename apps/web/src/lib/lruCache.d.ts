export declare class LRUCache<T> {
  private readonly maxEntries;
  private readonly maxMemoryBytes;
  private cache;
  private totalSize;
  constructor(maxEntries: number, maxMemoryBytes: number);
  get(key: string): T | null;
  set(key: string, value: T, approximateSize: number): void;
  clear(): void;
  private promote;
  private evictIfNeeded;
}
