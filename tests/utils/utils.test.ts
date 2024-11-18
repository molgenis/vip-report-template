import { describe, expect, test } from "vitest";
import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import {
  abbreviateHeader,
  getRecordLabel,
  href,
  isPositiveInteger,
  parseId,
  validateIntervalInput,
} from "../../src/utils/utils.ts";

describe("utils", () => {
  describe("getRecordLabel", () => {
    const recordBase = {
      data: {
        c: "chr1",
        p: 123,
        r: "A",
        a: [],
      },
    } as Partial<Item<Partial<VcfRecord>>> as Item<VcfRecord>;

    test("single allelic", () => {
      const record = { ...recordBase, data: { ...recordBase.data, a: ["C"] } };
      expect(getRecordLabel(record)).toStrictEqual("chr1:123 A>C");
    });

    test("multi allelic", () => {
      const record = { ...recordBase, data: { ...recordBase.data, a: ["C", "T"] } };
      expect(getRecordLabel(record)).toStrictEqual("chr1:123 A>C / A>T");
    });

    test("long ref or alt", () => {
      const record = { ...recordBase, data: { ...recordBase.data, r: "GTCAGTCA", a: ["ACTGACTG"] } };
      expect(getRecordLabel(record)).toStrictEqual("chr1:123 GT…A>AC…G");
    });

    test("missing alt", () => {
      const record = { ...recordBase, data: { ...recordBase.data, a: [null] } };
      expect(getRecordLabel(record)).toStrictEqual("chr1:123 A>.");
    });
  });

  test("href", () => {
    expect(href(["x", "/", "y"])).toStrictEqual("/x/%2F/y");
  });

  describe("isPositiveInteger", () => {
    test("2", () => {
      expect(isPositiveInteger(2)).toStrictEqual(true);
    });

    test("-2", () => {
      expect(isPositiveInteger(-2)).toStrictEqual(false);
    });

    test("1.23", () => {
      expect(isPositiveInteger(1.23)).toStrictEqual(false);
    });

    test("NaN", () => {
      expect(isPositiveInteger(NaN)).toStrictEqual(false);
    });
  });

  describe("parseId", () => {
    test("0", () => {
      expect(parseId("0")).toStrictEqual(0);
    });

    test("123", () => {
      expect(parseId("123")).toStrictEqual(123);
    });

    test("undefined", () => {
      expect(() => parseId(undefined)).toThrow();
    });
  });

  describe("abbreviateHeader", () => {
    test("abbreviate yes", () => {
      expect(abbreviateHeader("foo bar foo bar foo bar")).toStrictEqual("foo bar foo\u2026");
    });

    test("abbreviate no", () => {
      expect(abbreviateHeader("foo bar")).toStrictEqual("foo bar");
    });
  });

  describe("validateIntervalInput", () => {
    test("interval [1,]", () => {
      expect(validateIntervalInput("x", "1", undefined)).toStrictEqual(undefined);
    });

    test("interval [,1]", () => {
      expect(validateIntervalInput("x", "", "1")).toStrictEqual(undefined);
    });

    test("interval [1,1]", () => {
      expect(validateIntervalInput("x", "1", "1")).toStrictEqual(undefined);
    });

    test("interval [2,1]", () => {
      expect(validateIntervalInput("x", "2", "1")).toStrictEqual(
        "Input 'to' (1) for filter 'x' should have a higher value than the 'from' input (2).",
      );
    });

    test("interval [1.23,]", () => {
      expect(validateIntervalInput("x", "1.23", "")).toStrictEqual(undefined);
    });

    test("interval [,abc]", () => {
      expect(validateIntervalInput("x", "", "abc")).toStrictEqual(
        "Input 'to' (abc) for filter 'x' should be a number.",
      );
    });
  });
});
