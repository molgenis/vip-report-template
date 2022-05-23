import { describe, expect, test } from "vitest";
import { isNumerical } from "../utils/field";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

describe("field utilities", () => {
  test("FLOAT is numerical", () => {
    expect(isNumerical({ type: "FLOAT" } as FieldMetadata)).toBe(true);
  });

  test("INTEGER is numerical", () => {
    expect(isNumerical({ type: "INTEGER" } as FieldMetadata)).toBe(true);
  });

  test("STRING is not numerical", () => {
    expect(isNumerical({ type: "STRING" } as FieldMetadata)).toBe(false);
  });
});
