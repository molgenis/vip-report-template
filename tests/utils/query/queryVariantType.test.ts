import { describe, expect, test } from "vitest";
import { createQueryVariantType } from "../../../src/utils/query/queryVariantType.ts";
import { VariantType } from "../../../src/utils/variantType.ts";

describe("query variant type", () => {
  describe("createQueryVariantType", () => {
    test("all", () => {
      const variantType = { id: "all" } as VariantType;
      expect(createQueryVariantType(variantType)).toStrictEqual(null);
    });

    test("snv", () => {
      const variantType = { id: "snv" } as VariantType;
      expect(createQueryVariantType(variantType)).toStrictEqual({
        args: [
          {
            args: null,
            operator: "==",
            selector: ["n", "SVTYPE"],
          },
          { args: undefined, operator: "==", selector: ["n", "SVTYPE"] },
        ],
        operator: "or",
      });
    });

    test("str", () => {
      const variantType = { id: "str" } as VariantType;
      expect(createQueryVariantType(variantType)).toStrictEqual({
        args: "STR",
        operator: "==",
        selector: ["n", "SVTYPE"],
      });
    });

    test("sv", () => {
      const variantType = { id: "sv" } as VariantType;
      expect(createQueryVariantType(variantType)).toStrictEqual({
        args: [
          {
            args: "STR",
            operator: "!=",
            selector: ["n", "SVTYPE"],
          },
          { args: null, operator: "!=", selector: ["n", "SVTYPE"] },
          {
            args: undefined,
            operator: "!=",
            selector: ["n", "SVTYPE"],
          },
        ],
        operator: "and",
      });
    });
  });
});
