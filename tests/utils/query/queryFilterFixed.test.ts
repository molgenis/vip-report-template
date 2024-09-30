import { afterEach, describe, expect, test, vi } from "vitest";
import { createQueryFilterFixed } from "../../../src/utils/query/queryFilterFixed.ts";
import {
  ConfigFilterAlt,
  ConfigFilterChrom,
  ConfigFilterFilter,
  ConfigFilterId,
  ConfigFilterPos,
  ConfigFilterQual,
  ConfigFilterRef,
} from "../../../src/types/configFilter";
import { createQueryFilterClosedInterval, createQueryFilterString } from "../../../src/utils/query/queryFilter.ts";
import { Query } from "@molgenis/vip-report-api";

describe("query filter fixed", () => {
  vi.mock(import("../../../src/utils/query/queryFilter.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createQueryFilterFixed", () => {
    const query: Query = { selector: "x", operator: "==", args: "y" };

    test("chrom", () => {
      const config = { type: "fixed", id: "chrom" } as ConfigFilterChrom;
      const value = ["chr1"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterFixed(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["c"], value, false, false);
    });

    test("pos", () => {
      const config = { type: "fixed", id: "pos" } as ConfigFilterPos;
      const value = { left: 1, right: 2 };
      vi.mocked(createQueryFilterClosedInterval).mockReturnValue(query);
      expect(createQueryFilterFixed(config, value)).toStrictEqual(query);
      expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["p"], value);
    });

    test("id", () => {
      const config = { type: "fixed", id: "id" } as ConfigFilterId;
      const value = ["id0"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterFixed(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["i"], value, true, false);
    });

    test("ref", () => {
      const config = { type: "fixed", id: "ref" } as ConfigFilterRef;
      const value = ["C"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterFixed(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["r"], value, false, false);
    });

    test("alt", () => {
      const config = { type: "fixed", id: "alt" } as ConfigFilterAlt;
      const value = ["C"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterFixed(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["a"], value, true, false);
    });

    test("qual", () => {
      const config = { type: "fixed", id: "qual" } as ConfigFilterQual;
      const value = { left: 1, right: 2 };
      vi.mocked(createQueryFilterClosedInterval).mockReturnValue(query);
      expect(createQueryFilterFixed(config, value)).toStrictEqual(query);
      expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["q"], value);
    });

    test("id", () => {
      const config = { type: "fixed", id: "filter" } as ConfigFilterFilter;
      const value = ["filter0"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterFixed(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["f"], value, true, false);
    });

    test("invalid", () => {
      const config = { type: "fixed", id: "invalid" } as ConfigFilterFilter;
      expect(() => createQueryFilterFixed(config, ["value"])).toThrow();
    });
  });
});
