import { coverageConfigDefaults, defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import inlinePlugin from "@molgenis/vite-plugin-inline";

export default defineConfig(({ command }) => ({
  plugins: [solidPlugin(), inlinePlugin()],
  esbuild: {
    // @molgenis/vite-plugin-inline requires ascii input and cannot handle UTF-8 input
    charset: "ascii",
    pure: command === "build" ? [] : [],
  },
  build: {
    modulePreload: false,
    reportCompressedSize: false,
    // inline plugin build options
    rollupOptions: {
      input: ["./index.html", "./node_modules/@molgenis/vite-plugin-inline/dist/loader.mjs"],
      output: {
        manualChunks: undefined,
      },
    },
  },
  assetsInclude: "**/*.blob",
  test: {
    coverage: {
      include: ["src/**"],
      exclude: [...coverageConfigDefaults.exclude, "src/mocks/**"],
      // TODO add .tsx once component tests are added
      extension: [".ts"],
      thresholds: {
        branches: 80,
        lines: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
}));
