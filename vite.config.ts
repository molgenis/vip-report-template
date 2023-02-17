import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import inlinePlugin from "@molgenis/vite-plugin-inline/src/vite-plugin-inline.js";

export default defineConfig({
  plugins: [solidPlugin(), inlinePlugin()],
  esbuild: {
    // @molgenis/vite-plugin-inline requires ascii input and cannot handle UTF-8 input
    charset: "ascii",
  },
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
