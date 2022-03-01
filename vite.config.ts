import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import inline from "./src/plugin/vite-plugin-inline";
import { vueI18n } from "@intlify/vite-plugin-vue-i18n";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueI18n({ include: path.resolve(__dirname, "./src/locales/**") }), inline()],
  build: {
    rollupOptions: {
      input: ["./index.html", "./src/plugin/loader.ts"],
      output: {
        manualChunks: undefined,
      },
    },
  },
});
