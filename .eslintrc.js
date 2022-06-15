module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:solid/typescript",
  ],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "solid/prefer-show": "off",
  },
  plugins: ["prettier", "@typescript-eslint"],
};
