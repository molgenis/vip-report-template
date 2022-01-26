import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import inline from "./src/plugin/vite-plugin-inline";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), inline()],
  build: {
    rollupOptions: {
      input: ["./index.html", "./src/plugin/loader.ts"],
      output: {
        manualChunks: undefined,
      },
    },
  },
});
