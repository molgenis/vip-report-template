import { afterEach, describe, expect, test, vi } from "vitest";
import { createQueryFilterComposed } from "../../../src/utils/query/queryFilterComposed.ts";
import {
  ConfigFilterAllelicImbalance,
  ConfigFilterComposed,
  ConfigFilterDeNovo,
  ConfigFilterHpo,
  ConfigFilterInheritanceMatch,
  ConfigFilterLocus,
  ConfigFilterVipC,
  ConfigFilterVipCS,
  FilterValueHpo,
  FilterValueLocus,
  FilterValueVipC,
  FilterValueVipCS,
} from "../../../src/types/configFilterComposed";
import { Query } from "@molgenis/vip-report-api";
import {
  createQueryFilterClosedInterval,
  createQueryFilterClosedIntervalOutside,
  createQueryFilterString,
} from "../../../src/utils/query/queryFilter.ts";
import { SampleContainer } from "../../../src/utils/api.ts";
import { createQueryFilterFieldCategorical } from "../../../src/utils/query/queryFilterField.ts";

describe("query composed filters", () => {
  vi.mock(import("../../../src/utils/query/queryFilter.ts"));
  vi.mock(import("../../../src/utils/query/queryFilterField.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createQueryFilterComposed", () => {
    const query: Query = { selector: "x", operator: "==", args: "y" };

    test("hpo", () => {
      const field = { id: "f", number: {}, categories: {} };
      const config = { type: "composed", id: "composed/hpo", field: field } as ConfigFilterHpo;
      const value = ["chr1"] as FilterValueHpo;
      vi.mocked(createQueryFilterFieldCategorical).mockReturnValue(query);
      expect(createQueryFilterComposed(config, value)).toStrictEqual(query);
      expect(createQueryFilterFieldCategorical).toHaveBeenCalledWith(["n", "f"], field, value);
    });

    describe("locus", () => {
      const query: Query = { selector: "c", operator: "==", args: "chr1" };

      test("locus chr+start+end", () => {
        const queryPos: Query = { selector: "z", operator: "==", args: "y" };

        const config = { type: "composed", id: "composed/locus" } as ConfigFilterLocus;
        const value = { chromosome: "chr1", start: 1, end: 2 } as FilterValueLocus;
        vi.mocked(createQueryFilterString).mockReturnValue(query);
        vi.mocked(createQueryFilterClosedInterval).mockReturnValue(queryPos);
        expect(createQueryFilterComposed(config, value)).toStrictEqual({
          args: [query, queryPos],
          operator: "and",
        });
        expect(createQueryFilterString).toHaveBeenCalledWith(["c"], ["chr1"], false, false);
        expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["p"], { left: 1, right: 2 });
      });

      test("locus chr+start", () => {
        const queryPos: Query = { selector: "z", operator: "==", args: "y" };

        const config = { type: "composed", id: "composed/locus" } as ConfigFilterLocus;
        const value = { chromosome: "chr1", start: 1 } as FilterValueLocus;
        vi.mocked(createQueryFilterString).mockReturnValue(query);
        vi.mocked(createQueryFilterClosedInterval).mockReturnValue(queryPos);
        expect(createQueryFilterComposed(config, value)).toStrictEqual({
          args: [query, queryPos],
          operator: "and",
        });
        expect(createQueryFilterString).toHaveBeenCalledWith(["c"], ["chr1"], false, false);
        expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["p"], { left: 1, right: undefined });
      });

      test("locus chr+end", () => {
        const queryPos: Query = { selector: "z", operator: "==", args: "y" };

        const config = { type: "composed", id: "composed/locus" } as ConfigFilterLocus;
        const value = { chromosome: "chr1", end: 2 } as FilterValueLocus;
        vi.mocked(createQueryFilterString).mockReturnValue(query);
        vi.mocked(createQueryFilterClosedInterval).mockReturnValue(queryPos);
        expect(createQueryFilterComposed(config, value)).toStrictEqual({
          args: [query, queryPos],
          operator: "and",
        });
        expect(createQueryFilterString).toHaveBeenCalledWith(["c"], ["chr1"], false, false);
        expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["p"], { left: undefined, right: 2 });
      });

      test("locus chr", () => {
        const config = { type: "composed", id: "composed/locus" } as ConfigFilterLocus;
        const value = { chromosome: "chr1" } as FilterValueLocus;
        vi.mocked(createQueryFilterString).mockReturnValue(query);
        expect(createQueryFilterComposed(config, value)).toStrictEqual(query);
        expect(createQueryFilterString).toHaveBeenCalledWith(["c"], ["chr1"], false, false);
      });
    });

    describe("allelicImbalance", () => {
      const config = {
        type: "composed",
        id: "composed/allelicImbalance",
        sample: { item: { data: { index: 1 } } } as SampleContainer,
        viabField: { id: "VIAB" },
        genotypeField: { id: "GT" },
      } as ConfigFilterAllelicImbalance;
      const queryInterval: Query = { selector: "viab", operator: "==", args: "inside" };
      const queryIntervalClosed: Query = { selector: "viab", operator: "==", args: "outside" };

      const expectedTrueQuery = {
        args: [
          {
            args: [
              { selector: ["s", 1, "GT", "t"], operator: "in", args: ["hom_a", "hom_r"] },
              { selector: "viab", operator: "==", args: "inside" },
            ],
            operator: "and",
          },
          {
            args: [
              { selector: ["s", 1, "GT", "t"], operator: "==", args: "het" },
              { selector: "viab", operator: "==", args: "outside" },
            ],
            operator: "and",
          },
        ],
        operator: "or",
      };

      test("true", () => {
        vi.mocked(createQueryFilterClosedInterval).mockReturnValue(queryInterval);
        vi.mocked(createQueryFilterClosedIntervalOutside).mockReturnValue(queryIntervalClosed);
        expect(createQueryFilterComposed(config, ["true"])).toStrictEqual(expectedTrueQuery);
        expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["s", 1, "VIAB"], { left: 0.02, right: 0.98 });
        expect(createQueryFilterClosedIntervalOutside).toHaveBeenCalledWith(["s", 1, "VIAB"], {
          left: 0.2,
          right: 0.8,
        });
      });

      const expectedFalseQuery = {
        args: [
          {
            args: [
              { selector: ["s", 1, "GT", "t"], operator: "in", args: ["hom_a", "hom_r"] },
              { selector: "viab", operator: "==", args: "outside" },
            ],
            operator: "and",
          },
          {
            args: [
              { selector: ["s", 1, "GT", "t"], operator: "==", args: "het" },
              { selector: "viab", operator: "==", args: "inside" },
            ],
            operator: "and",
          },
        ],
        operator: "or",
      };

      test("false", () => {
        vi.mocked(createQueryFilterClosedInterval).mockReturnValue(queryInterval);
        vi.mocked(createQueryFilterClosedIntervalOutside).mockReturnValue(queryIntervalClosed);
        expect(createQueryFilterComposed(config, ["false"])).toStrictEqual(expectedFalseQuery);
        expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["s", 1, "VIAB"], {
          left: 0.2,
          right: 0.8,
        });
        expect(createQueryFilterClosedIntervalOutside).toHaveBeenCalledWith(["s", 1, "VIAB"], {
          left: 0.02,
          right: 0.98,
        });
      });

      const expectedNullQuery = {
        args: [
          { selector: ["s", 1, "VIAB"], operator: "==", args: null },
          { selector: ["s", 1, "VIAB"], operator: "==", args: undefined },
        ],
        operator: "or",
      };

      test("__null", () => {
        vi.mocked(createQueryFilterClosedInterval).mockReturnValue(queryInterval);
        vi.mocked(createQueryFilterClosedIntervalOutside).mockReturnValue(queryIntervalClosed);
        expect(createQueryFilterComposed(config, ["__null"])).toStrictEqual(expectedNullQuery);
      });

      test("mixed", () => {
        vi.mocked(createQueryFilterClosedInterval).mockReturnValue(queryInterval);
        vi.mocked(createQueryFilterClosedIntervalOutside).mockReturnValue(queryIntervalClosed);

        expect(createQueryFilterComposed(config, ["true", "__null"])).toStrictEqual({
          args: [expectedTrueQuery, expectedNullQuery],
          operator: "or",
        });
      });
    });

    describe("inheritanceMatch", () => {
      const config = {
        type: "composed",
        id: "composed/inheritanceMatch",
        sample: { item: { data: { index: 1 } } } as SampleContainer,
        vimField: { id: "VIM" },
      } as ConfigFilterInheritanceMatch;

      test("true", () => {
        expect(createQueryFilterComposed(config, ["true"])).toStrictEqual({
          selector: ["s", 1, "VIM"],
          operator: "==",
          args: 1,
        });
      });

      test("false", () => {
        expect(createQueryFilterComposed(config, ["false"])).toStrictEqual({
          selector: ["s", 1, "VIM"],
          operator: "==",
          args: 0,
        });
      });

      test("potential", () => {
        expect(createQueryFilterComposed(config, ["potential"])).toStrictEqual({
          args: [
            { selector: ["s", 1, "VIM"], operator: "==", args: null },
            { selector: ["s", 1, "VIM"], operator: "==", args: undefined },
          ],
          operator: "or",
        });
      });

      test("match and potential", () => {
        expect(createQueryFilterComposed(config, ["true","potential"])).toStrictEqual(
          {
            args: [{
              selector: ["s", 1, "VIM"],
              operator: "==",
              args: 1,
            },
            {
              args: [
                { selector: ["s", 1, "VIM"], operator: "==", args: null },
                { selector: ["s", 1, "VIM"], operator: "==", args: undefined },
              ],
              operator: "or",
            }],
            operator: "or",
          });
      });
    });

    describe("deNovo", () => {
      const config = {
        type: "composed",
        id: "composed/deNovo",
        sample: { item: { data: { index: 1 } } } as SampleContainer,
        vidField: { id: "VID" },
      } as ConfigFilterDeNovo;

      test("true", () => {
        expect(createQueryFilterComposed(config, ["true"])).toStrictEqual({
          selector: ["s", 1, "VID"],
          operator: "==",
          args: 1,
        });
      });

      test("false", () => {
        expect(createQueryFilterComposed(config, ["false"])).toStrictEqual({
          selector: ["s", 1, "VID"],
          operator: "==",
          args: 0,
        });
      });

      test("potential", () => {
        expect(createQueryFilterComposed(config, ["potential"])).toStrictEqual({
          args: [
            { selector: ["s", 1, "VID"], operator: "==", args: null },
            { selector: ["s", 1, "VID"], operator: "==", args: undefined },
          ],
          operator: "or",
        });
      });
    });

    test("vipC", () => {
      const field = { id: "f", number: {}, categories: {} };
      const config = { type: "composed", id: "composed/vipC", field: field } as ConfigFilterVipC;
      const value = ["chr1"] as FilterValueVipC;
      vi.mocked(createQueryFilterFieldCategorical).mockReturnValue(query);
      expect(createQueryFilterComposed(config, value)).toStrictEqual(query);
      expect(createQueryFilterFieldCategorical).toHaveBeenCalledWith(["n", "f"], field, value);
    });

    test("vipCS", () => {
      const sample = { item: { data: { index: 1 } } } as SampleContainer;
      const field = { id: "f", number: {}, categories: {} };
      const config = { type: "composed", id: "composed/vipCS", field, sample } as ConfigFilterVipCS;
      const value = ["chr1"] as FilterValueVipCS;
      vi.mocked(createQueryFilterFieldCategorical).mockReturnValue(query);
      expect(createQueryFilterComposed(config, value)).toStrictEqual(query);
      expect(createQueryFilterFieldCategorical).toHaveBeenCalledWith(["s", 1, "f"], field, value);
    });

    test("invalid", () => {
      const config = {
        type: "composed",
        id: "invalid",
      } as ConfigFilterComposed;
      expect(() => createQueryFilterComposed(config, ["value"])).toThrow();
    });
  });
});
