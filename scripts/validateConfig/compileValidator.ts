import Ajv from "ajv/dist/jtd";
import { readFileSync, writeFileSync } from "fs";

const schema = JSON.parse(readFileSync("schemaConfigJson.jtd.json", "utf-8"));
const ajv = new Ajv();
const validateCode = ajv.compile(schema).toString();

writeFileSync(
  "src/utils/config/configValidator.precompiled.ts",
  `import { ValidateFunction } from "ajv/dist/jtd";
import type { ConfigJson } from "../../types/config";

const validate: ValidateFunction<ConfigJson> = ${validateCode};
export default validate;`
);

console.log("✅ Wrote validateConfig.precompiled.js");