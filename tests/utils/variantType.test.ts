import { describe, expect, test } from "vitest";
import { getVariantTypes, mapSvTypeToVariantTypeId, parseVariantType } from "../../src/utils/variantType.ts";

describe("variantType", () => {
  test("getVariantTypes", () => {
    expect(getVariantTypes(new Set(["all", "snv"]))).toStrictEqual([
      {
        id: "all",
        label: "All",
        description: "All variants",
      },
      { id: "snv", label: "SNV", description: "Single nucleotide variants and Indels < 50 bases" },
    ]);
  });

  describe("parseVariantType", () => {
    test("parse valid", () => {
      expect(parseVariantType("snv")).toStrictEqual({
        id: "snv",
        label: "SNV",
        description: "Single nucleotide variants and Indels < 50 bases",
      });
    });

    test("parse invalid", () => {
      expect(() => parseVariantType("invalid")).toThrow();
    });

    test("parse undefined", () => {
      expect(() => parseVariantType(undefined)).toThrow();
    });
  });

  describe("mapSvTypeToVariantTypeId", () => {
    test("SVTYPE=null", () => {
      expect(mapSvTypeToVariantTypeId(null)).toStrictEqual("snv");
    });
    test("SVTYPE=undefined", () => {
      expect(mapSvTypeToVariantTypeId(undefined)).toStrictEqual("snv");
    });
    test("SVTYPE=STR", () => {
      expect(mapSvTypeToVariantTypeId("STR")).toStrictEqual("str");
    });
    test("SVTYPE something else", () => {
      expect(mapSvTypeToVariantTypeId("foo")).toStrictEqual("sv");
    });
  });
});
