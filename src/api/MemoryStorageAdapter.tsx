import { StorageAdapter } from "./StorageAdapter";

export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  get(key: string) {
    return this.store.get(key) ?? null;
  }

  set(key: string, value: string) {
    this.store.set(key, value);
  }

  remove(key: string) {
    this.store.delete(key);
  }

  keys() {
    return Array.from(this.store.keys());
  }
}
