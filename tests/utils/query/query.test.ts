import { afterEach, describe, expect, test, vi } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf";

import { createInfoSortPath } from "../../../src/utils/query/selector.ts";
import { createQuery } from "../../../src/utils/query/query.ts";
import { createQueryVariantType } from "../../../src/utils/query/queryVariantType.ts";
import { createQuerySample } from "../../../src/utils/query/querySample.ts";
import { createQueryFilters } from "../../../src/utils/query/queryFilter.ts";
import { Query } from "@molgenis/vip-report-api";
import { Config, ConfigFilters, ConfigVariants, ConfigVip, ConfigVipParams } from "../../../src/types/config";
import { SampleContainer } from "../../../src/utils/api.ts";
import { VariantType } from "../../../src/utils/variantType.ts";
import { ConfigFilterFixed } from "../../../src/types/configFilter";

describe("query", () => {
  vi.mock(import("../../../src/utils/query/queryFilter.ts"));
  vi.mock(import("../../../src/utils/query/queryVariantType.ts"));
  vi.mock(import("../../../src/utils/query/querySample.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createQuery", () => {
    const configFilters: ConfigFilters = [{ type: "fixed", id: "chrom" } as ConfigFilterFixed];
    const configVip = { params: {} as ConfigVipParams } as ConfigVip;
    const config: Config = { vip: configVip, variants: { filters: configFilters } as ConfigVariants } as Config;
    const variantType = { id: "snv" } as VariantType;
    const sample = { item: { id: 2 } } as SampleContainer;
    const filterValues = { chrom: ["chr1"] };

    test("variant type, sample and filters", () => {
      const queryVariantType: Query = { selector: "a", operator: "==", args: "b" };
      const querySample: Query = { selector: "c", operator: "==", args: "d" };
      const queryFilters: Query = { selector: "e", operator: "==", args: "f" };
      vi.mocked(createQueryVariantType).mockReturnValue(queryVariantType);
      vi.mocked(createQuerySample).mockReturnValue(querySample);
      vi.mocked(createQueryFilters).mockReturnValue(queryFilters);

      expect(createQuery(config, variantType, sample, filterValues)).toStrictEqual({
        args: [
          { selector: "a", operator: "==", args: "b" },
          { selector: "c", operator: "==", args: "d" },
          { selector: "e", operator: "==", args: "f" },
        ],
        operator: "and",
      });
      expect(createQueryVariantType).toHaveBeenCalledWith(variantType);
      expect(createQuerySample).toHaveBeenCalledWith(configVip, sample);
      expect(createQueryFilters).toHaveBeenCalledWith(configFilters, filterValues);
    });

    test("sample", () => {
      const querySample: Query = { selector: "c", operator: "==", args: "d" };
      vi.mocked(createQueryVariantType).mockReturnValue(null);
      vi.mocked(createQuerySample).mockReturnValue(querySample);
      vi.mocked(createQueryFilters).mockReturnValue(null);

      expect(createQuery(config, variantType, sample, filterValues)).toStrictEqual(querySample);
      expect(createQueryVariantType).toHaveBeenCalledWith(variantType);
      expect(createQuerySample).toHaveBeenCalledWith(configVip, sample);
      expect(createQueryFilters).toHaveBeenCalledWith(configFilters, filterValues);
    });

    test("variant type=null, sample=null and filters=null", () => {
      const variantType = { id: "all" } as VariantType;
      vi.mocked(createQueryVariantType).mockReturnValue(null);
      vi.mocked(createQueryFilters).mockReturnValue(null);

      expect(createQuery(config, variantType, null, filterValues)).toStrictEqual(null);
      expect(createQueryVariantType).toHaveBeenCalledWith(variantType);
      expect(createQueryFilters).toHaveBeenCalledWith(configFilters, filterValues);
    });
  });

  test("infoSortPath", () => {
    const fieldMetaCsq: FieldMetadata = {
      id: "CSQ",
      number: { type: "NUMBER" },
      type: "STRING",
    };
    expect(createInfoSortPath(fieldMetaCsq)).toStrictEqual(["n", "CSQ"]);
  });
});
