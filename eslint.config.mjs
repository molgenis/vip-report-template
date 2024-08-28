import pluginJs from "@eslint/js";
// workaround: import .js because of https://github.com/solidjs-community/eslint-plugin-solid/issues/118
import solid from "eslint-plugin-solid/configs/typescript.js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  pluginJs.configs.recommended,
  solid,
  ...tseslint.configs.recommended,
];
