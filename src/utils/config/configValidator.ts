import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
import { Json } from "@molgenis/vip-report-api";
import { ConfigValidationError } from "../error.ts";
import { ConfigJson } from "../../types/config";

const ajv = new Ajv();

const schema: JTDSchemaType<ConfigJson> = {
  properties: {
    vip: {
      properties: {
        filter_field: {
          properties: { type: { enum: ["genotype"] }, name: { type: "string" } },
          optionalProperties: { label: { type: "string" }, description: { type: "string" } },
        },
        params: {
          properties: {
            vcf: {
              properties: {
                filter: {
                  properties: { classes: { type: "string" }, consequences: { type: "boolean" } },
                  additionalProperties: true,
                },
                filter_samples: {
                  properties: { classes: { type: "string" } },
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
            },
          },
          optionalProperties: {
            cram: {
              properties: {
                call_snv: { type: "boolean" },
                call_str: { type: "boolean" },
                call_sv: { type: "boolean" },
                call_cnv: { type: "boolean" },
              },
              additionalProperties: true,
            },
          },
          additionalProperties: true,
        },
      },
    },
    sample_variants: { properties: {}, additionalProperties: true }, // FIXME define properties
    variants: { properties: {}, additionalProperties: true }, // FIXME define properties
  },
};

const validate = ajv.compile(schema);

export function validateConfig(json: Json): ConfigJson {
  const valid = validate(json);
  if (valid) {
    return json; // json is 'ConfigStatic' here
  } else {
    throw new ConfigValidationError(validate);
  }
}
