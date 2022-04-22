import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import inlinePlugin from "./src/plugin/vite-plugin-inline";

export default defineConfig({
  plugins: [solidPlugin(), inlinePlugin()],
  build: {
    polyfillDynamicImport: false,
    // inline plugin build options
    rollupOptions: {
      input: ["./index.html", "./src/plugin/loader.ts"],
      output: {
        manualChunks: undefined,
      },
    },
  },
  assetsInclude: "**/*.blob",
});
