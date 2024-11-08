import { describe, expect, test } from "vitest";
import { isNumerical } from "../utils/field";
import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { abbreviateHeader } from "../utils/utils.ts";

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
