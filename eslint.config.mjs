// workaround: import .js because of https://github.com/solidjs-community/eslint-plugin-solid/issues/118
import solid from "eslint-plugin-solid/configs/typescript";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/*.precompiled.ts"],
  },
  { files: ["**/*.{ts,tsx}"] },
  solid,
  ...tseslint.configs.recommended,
];
