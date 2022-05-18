import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import inlinePlugin from "@molgenis/vite-plugin-inline/src/vite-plugin-inline.js";

export default defineConfig({
  plugins: [solidPlugin(), inlinePlugin()],
  build: {
    polyfillDynamicImport: false,
    // inline plugin build options
    rollupOptions: {
      input: ["./index.html", "@molgenis/vite-plugin-inline/src/loader.ts"],
      output: {
        manualChunks: undefined,
      },
    },
  },
  assetsInclude: "**/*.blob",
});
