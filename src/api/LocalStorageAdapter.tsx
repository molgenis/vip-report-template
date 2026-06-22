import { StorageAdapter } from "./StorageAdapter";

export class LocalStorageAdapter implements StorageAdapter {
    get(key: string) {
      return localStorage.getItem(key);
    }
  
    set(key: string, value: string) {
      localStorage.setItem(key, value);
    }
  
    remove(key: string) {
      localStorage.removeItem(key);
    }
  
    keys() {
      return Object.keys(localStorage);
    }
  }