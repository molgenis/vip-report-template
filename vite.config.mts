import { coverageConfigDefaults, defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import inlinePlugin from "@molgenis/vite-plugin-inline";;

export default defineConfig(({ command }) => ({
  server: {
    proxy: {
      "/RD3/graphql": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        headers: {
          "x-molgenis-token":
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6NDkzMDcwNjI3NiwiaWF0IjoxNzc1MDMyNjc2LCJqdGkiOiJ0ZXN0In0.AZ9ftcCiU3nU4khzz-Z_PBEU-6Ff7-qj39-9qFqHXQ4",
        },
      },
    },
  },
  plugins: [solidPlugin(), inlinePlugin()],
  esbuild: {
    // @molgenis/vite-plugin-inline requires ascii input and cannot handle UTF-8 input
    charset: "ascii",
    pure: command === "build" ? [] : [],
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
    // unclear how to migrate to new default Lightning CSS
    cssMinify: "esbuild",
    // unclear how to migrate to new default Oxc e.g. esbuild.charset and esbuild.pure
    minify: "esbuild",
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
