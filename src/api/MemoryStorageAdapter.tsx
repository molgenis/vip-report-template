import { StorageAdapter } from "./StorageAdapter";

export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  get(key: string) {
    console.log("GET");
    console.log(this.store);
    return this.store.get(key) ?? null;
  }

  set(key: string, value: string) {
    console.log("SET");
    this.store.set(key, value);
    console.log(this.store);
  }

  remove(key: string) {
    this.store.delete(key);
  }

  keys() {
    return Array.from(this.store.keys());
  }
}