import { describe, expect, test } from "vitest";
import { abbreviateHeader, isNumerical } from "../utils/field";
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

  test("abbreviate header long text", () => {
    expect(abbreviateHeader("abcdefghijklmnopqrstuvwxyz")).toBe("abcdefghijk\u2026");
  });

  test("abbreviate header short text", () => {
    expect(abbreviateHeader("abcdef")).toBe("abcdef");
  });
});
