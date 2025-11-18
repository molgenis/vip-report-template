import pluginJs from "@eslint/js";
// workaround: import .js because of https://github.com/solidjs-community/eslint-plugin-solid/issues/118
import solid from "eslint-plugin-solid/configs/typescript";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/*.precompiled.ts"
    ]
  },
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] },
  pluginJs.configs.recommended,
  solid,
  ...tseslint.configs.recommended,
];