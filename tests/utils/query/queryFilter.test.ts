import { afterEach, describe, expect, test, vi } from "vitest";
import {
  createQueryFilterClosedInterval,
  createQueryFilterClosedIntervalOutside,
  createQueryFilters,
  createQueryFilterString,
} from "../../../src/utils/query/queryFilter.ts";
import { Query, Selector } from "@molgenis/vip-report-api";
import { createQueryFilterComposed } from "../../../src/utils/query/queryFilterComposed.ts";
import { ConfigFilterComposed } from "../../../src/types/configFilterComposed";
import {
  ConfigFilterField,
  ConfigFilterFixed,
  ConfigFilterFormat,
  FilterValueString,
} from "../../../src/types/configFilter";
import { createQueryFilterFixed } from "../../../src/utils/query/queryFilterFixed.ts";
import { createQueryFilterField } from "../../../src/utils/query/queryFilterField.ts";
import { CategoryRecord } from "@molgenis/vip-report-vcf";

describe("query filters", () => {
  vi.mock(import("../../../src/utils/query/queryFilterComposed.ts"));
  vi.mock(import("../../../src/utils/query/queryFilterField.ts"));
  vi.mock(import("../../../src/utils/query/queryFilterFixed.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createQueryFilters", () => {
    const query: Query = { selector: "x", operator: "==", args: "y" };

    test("composed", () => {
      const config0 = { type: "composed", id: "c0" } as ConfigFilterComposed;
      const config1 = { type: "composed", id: "c1" } as ConfigFilterComposed;
      const value0 = ["my_value"];
      const filterValues = { c0: value0 };
      vi.mocked(createQueryFilterComposed).mockReturnValue(query);
      expect(createQueryFilters([config0, config1], filterValues)).toStrictEqual(query);
      expect(createQueryFilterComposed).toHaveBeenCalledWith(config0, value0);
    });

    test("fixed", () => {
      const config = { type: "fixed", id: "chrom" } as ConfigFilterFixed;
      const value = ["chr1"];
      const filterValues = { chrom: value };
      vi.mocked(createQueryFilterFixed).mockReturnValue(query);
      expect(createQueryFilters([config], filterValues)).toStrictEqual(query);
      expect(createQueryFilterFixed).toHaveBeenCalledWith(config, value);
    });

    test("genotype", () => {
      const config = { type: "genotype", id: "f" } as ConfigFilterFormat;
      const value = ["x"];
      const filterValues = { f: value };
      vi.mocked(createQueryFilterField).mockReturnValue(query);
      expect(createQueryFilters([config], filterValues)).toStrictEqual(query);
      expect(createQueryFilterField).toHaveBeenCalledWith(config, value);
    });

    test("info", () => {
      const config = { type: "info", id: "f" } as ConfigFilterField;
      const value = ["x"];
      const filterValues = { f: value };
      vi.mocked(createQueryFilterField).mockReturnValue(query);
      expect(createQueryFilters([config], filterValues)).toStrictEqual(query);
      expect(createQueryFilterField).toHaveBeenCalledWith(config, value);
    });

    test("mixed", () => {
      const query0: Query = query;
      const query1: Query = { selector: "y", operator: "==", args: "z" };

      const config0 = { type: "composed", id: "c0" } as ConfigFilterComposed;
      const config1 = { type: "fixed", id: "chrom" } as ConfigFilterComposed;
      const value0 = ["my_value"];
      const value1 = ["chr1"];
      const filterValues = { c0: value0, chrom: value1 };
      vi.mocked(createQueryFilterComposed).mockReturnValue(query0);
      vi.mocked(createQueryFilterFixed).mockReturnValue(query1);
      expect(createQueryFilters([config0, config1], filterValues)).toStrictEqual({
        args: [query0, query1],
        operator: "and",
      });
      expect(createQueryFilterComposed).toHaveBeenCalledWith(config0, value0);
      expect(createQueryFilterFixed).toHaveBeenCalledWith(config1, value1);
    });

    test("return null", () => {
      const config0 = { type: "composed", id: "c0" } as ConfigFilterComposed;
      const filterValues = {};
      expect(createQueryFilters([config0], filterValues)).toStrictEqual(null);
    });
  });

  describe("createQueryFilterClosedInterval", () => {
    const selector: Selector = ["x"];

    test("left", () => {
      expect(createQueryFilterClosedInterval(selector, { left: 1, right: undefined })).toStrictEqual({
        selector: ["x"],
        operator: ">=",
        args: 1,
      });
    });

    test("right", () => {
      expect(createQueryFilterClosedInterval(selector, { left: undefined, right: 2 })).toStrictEqual({
        selector: ["x"],
        operator: "<=",
        args: 2,
      });
    });

    test("left and right", () => {
      expect(createQueryFilterClosedInterval(selector, { left: 1, right: 2 })).toStrictEqual({
        args: [
          { selector: ["x"], operator: ">=", args: 1 },
          { selector: ["x"], operator: "<=", args: 2 },
        ],
        operator: "and",
      });
    });

    test("left=undefined and right=undefined", () => {
      expect(() =>
        createQueryFilterClosedInterval(selector, {
          left: undefined,
          right: undefined,
        }),
      ).toThrow();
    });
  });

  describe("createQueryFilterClosedIntervalOutside", () => {
    const selector: Selector = ["x"];

    test("left", () => {
      expect(createQueryFilterClosedIntervalOutside(selector, { left: 1, right: undefined })).toStrictEqual({
        selector: ["x"],
        operator: "<",
        args: 1,
      });
    });

    test("right", () => {
      expect(createQueryFilterClosedIntervalOutside(selector, { left: undefined, right: 2 })).toStrictEqual({
        selector: ["x"],
        operator: ">",
        args: 2,
      });
    });

    test("left and right", () => {
      expect(createQueryFilterClosedIntervalOutside(selector, { left: 1, right: 2 })).toStrictEqual({
        args: [
          { selector: ["x"], operator: "<", args: 1 },
          { selector: ["x"], operator: ">", args: 2 },
        ],
        operator: "or",
      });
    });

    test("left=undefined and right=undefined", () => {
      expect(() =>
        createQueryFilterClosedIntervalOutside(selector, {
          left: undefined,
          right: undefined,
        }),
      ).toThrow();
    });
  });

  describe("createQueryFilterString", () => {
    const selector: Selector = ["x"];

    test("multi_value=false nested_value=false args=single", () => {
      const value: FilterValueString = ["y"];
      expect(createQueryFilterString(selector, value, false, false)).toStrictEqual({
        selector: ["x"],
        operator: "in",
        args: ["y"],
      });
    });

    test("multi_value=false nested_value=false args=multi", () => {
      const value: FilterValueString = ["y", "z"];
      expect(createQueryFilterString(selector, value, false, false)).toStrictEqual({
        selector: ["x"],
        operator: "in",
        args: ["y", "z"],
      });
    });

    test("multi_value=true nested_value=false args=single", () => {
      const value: FilterValueString = ["y"];
      expect(createQueryFilterString(selector, value, true, false)).toStrictEqual({
        selector: ["x"],
        operator: "has_any",
        args: ["y"],
      });
    });

    test("multi_value=false nested_value=true args=single", () => {
      const value: FilterValueString = ["y"];
      expect(createQueryFilterString(selector, value, false, true)).toStrictEqual({
        selector: ["x"],
        operator: "has_any",
        args: ["y"],
      });
    });

    test("multi_value=true nested_value=true args=single", () => {
      const value: FilterValueString = ["y"];
      expect(createQueryFilterString(selector, value, true, true)).toStrictEqual({
        selector: ["x"],
        operator: "any_has_any",
        args: ["y"],
      });
    });

    describe("categorical workaround", () => {
      const categories: CategoryRecord = { c0: { label: "c0" }, c1: { label: "c1" } };

      test("categorical __null", () => {
        const value: FilterValueString = ["__null"];

        expect(createQueryFilterString(selector, value, false, false, categories)).toStrictEqual({
          selector: ["x"],
          operator: "!in",
          args: ["c0", "c1"],
        });
      });

      test("categorical category and __null", () => {
        const value: FilterValueString = ["c0", "__null"];

        expect(createQueryFilterString(selector, value, false, false, categories)).toStrictEqual({
          args: [
            { selector: ["x"], operator: "in", args: ["c0"] },
            { selector: ["x"], operator: "!in", args: ["c0", "c1"] },
          ],
          operator: "or",
        });
      });
    });
  });
});
