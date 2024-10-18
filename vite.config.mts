import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import inlinePlugin from "@molgenis/vite-plugin-inline";

export default defineConfig(({ mode }) => ({
  plugins: [solidPlugin(), inlinePlugin()],
  esbuild: {
    // @molgenis/vite-plugin-inline requires ascii input and cannot handle UTF-8 input
    charset: "ascii",
    drop: mode === "production " ? ["console", "debugger"] : [],
  },
  build: {
    // inline plugin build options
    rollupOptions: {
      input: ["./index.html", "./node_modules/@molgenis/vite-plugin-inline/dist/loader.mjs"],
      output: {
        manualChunks: undefined,
      },
    },
  },
  assetsInclude: "**/*.blob",
  logLevel: mode === "production " ? "warn" : "info",
}));
