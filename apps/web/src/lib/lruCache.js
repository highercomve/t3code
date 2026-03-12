export class LRUCache {
  maxEntries;
  maxMemoryBytes;
  cache = new Map();
  totalSize = 0;
  constructor(maxEntries, maxMemoryBytes) {
    this.maxEntries = maxEntries;
    this.maxMemoryBytes = maxMemoryBytes;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    this.promote(key, entry);
    return entry.value;
  }
  set(key, value, approximateSize) {
    const existing = this.cache.get(key);
    if (existing) {
      this.totalSize -= existing.approximateSize;
      this.cache.delete(key);
    }
    this.evictIfNeeded(approximateSize);
    this.cache.set(key, { value, approximateSize });
    this.totalSize += approximateSize;
  }
  clear() {
    this.cache.clear();
    this.totalSize = 0;
  }
  promote(key, entry) {
    this.cache.delete(key);
    this.cache.set(key, entry);
  }
  evictIfNeeded(incomingSize) {
    while (
      (this.cache.size >= this.maxEntries || this.totalSize + incomingSize > this.maxMemoryBytes) &&
      this.cache.size > 0
    ) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey === undefined) {
        break;
      }
      const oldestEntry = this.cache.get(oldestKey);
      if (oldestEntry) {
        this.totalSize -= oldestEntry.approximateSize;
      }
      this.cache.delete(oldestKey);
    }
  }
}
