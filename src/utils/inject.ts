import { inject, InjectionKey } from "vue";

function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.description || "undefined"}`);
  }

  return resolved;
}

export { injectStrict };
