import { coverageConfigDefaults, defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import inlinePlugin from "@molgenis/vite-plugin-inline";

export default defineConfig(({ command }) => ({
  plugins: [solidPlugin(), inlinePlugin()],
  esbuild: {
    // @molgenis/vite-plugin-inline requires ascii input and cannot handle UTF-8 input
    charset: "ascii",
    pure: command === "build" ? ["console.log"] : [],
  },
  build: {
    target: "es2022",
    modulePreload: false,
    reportCompressedSize: false,
    // inline plugin build options
    rollupOptions: {
      input: ["./index.html", "./node_modules/@molgenis/vite-plugin-inline/dist/loader/loader.js"],
      output: {
        manualChunks: undefined,
      },
    },
  },
  assetsInclude: "**/*.blob",
  test: {
    coverage: {
      // TODO remove /*.ts postfix once component tests are added
      include: ["src/**/*.ts"],
      exclude: [...coverageConfigDefaults.exclude, "src/mocks/**", "**/*.precompiled.ts"],
      thresholds: {
        branches: 70,
        lines: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
}));
