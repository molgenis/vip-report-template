import { Json } from "@molgenis/vip-report-api";
import { ConfigValidationError } from "../error.ts";
import { ConfigJson } from "../../types/config";
import validate from "./configValidator.precompiled.ts";

//se /scripts/validateConfig for instructions to update the schema

export function validateConfig(json: Json): ConfigJson {
  const valid = validate(json);
  if (valid) {
    return json; // json is 'ConfigStatic' here
  } else {
    throw new ConfigValidationError(validate);
  }
}
