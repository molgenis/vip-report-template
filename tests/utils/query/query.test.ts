import { afterEach, describe, expect, test, vi } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf";

import { createInfoSortPath } from "../../../src/utils/query/selector.ts";
import { createQuery } from "../../../src/utils/query/query.ts";
import { createQueryVariantType } from "../../../src/utils/query/queryVariantType.ts";
import { createQuerySample } from "../../../src/utils/query/querySample.ts";
import { createQueryFilters } from "../../../src/utils/query/queryFilter.ts";
import { Query } from "@molgenis/vip-report-api";
import { Config, ConfigFilters, ConfigVariants, ConfigVip, ConfigVipParams } from "../../../src/types/config";
import { MetadataContainer, SampleContainer, VcfMetadataContainer } from "../../../src/utils/api.ts";
import { VariantType } from "../../../src/utils/variantType.ts";
import { ConfigFilterFixed } from "../../../src/types/configFilter";
import { FieldMetadataWrapper } from "../../../src/utils/vcf.ts";

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
      const fieldMetadata = { id: "GT", number: { type: "NUMBER", count: 1 } } as FieldMetadataWrapper;
      const vcfMetadata = {
        format: { GT: fieldMetadata },
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
      const meta = {
        app: {},
        records: vcfMetadata,
        variantTypeIds: { }
      } as MetadataContainer
      vi.mocked(createQueryVariantType).mockReturnValue(queryVariantType);
      vi.mocked(createQuerySample).mockReturnValue(querySample);
      vi.mocked(createQueryFilters).mockReturnValue(queryFilters);

      expect(createQuery(config, meta, variantType, sample, filterValues)).toStrictEqual({
        args: [
          { selector: "a", operator: "==", args: "b" },
          { selector: "c", operator: "==", args: "d" },
          { selector: "e", operator: "==", args: "f" },
        ],
        operator: "and",
      });
      expect(createQueryVariantType).toHaveBeenCalledWith(variantType);
      expect(createQuerySample).toHaveBeenCalledWith(configVip, sample, meta);
      expect(createQueryFilters).toHaveBeenCalledWith(configFilters, filterValues);
    });

    test("sample", () => {
      const querySample: Query = { selector: "c", operator: "==", args: "d" };
      const fieldMetadata = { id: "GT", number: { type: "NUMBER", count: 1 } } as FieldMetadataWrapper;
      const vcfMetadata = {
        format: { GT: fieldMetadata },
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
      const meta = {
        app: {},
        records: vcfMetadata,
        variantTypeIds: { }
      } as MetadataContainer
      vi.mocked(createQueryVariantType).mockReturnValue(null);
      vi.mocked(createQuerySample).mockReturnValue(querySample);
      vi.mocked(createQueryFilters).mockReturnValue(null);

      expect(createQuery(config, meta, variantType, sample, filterValues)).toStrictEqual(querySample);
      expect(createQueryVariantType).toHaveBeenCalledWith(variantType);
      expect(createQuerySample).toHaveBeenCalledWith(configVip, sample, meta);
      expect(createQueryFilters).toHaveBeenCalledWith(configFilters, filterValues);
    });

    test("variant type=null, sample=null and filters=null", () => {
      const variantType = { id: "all" } as VariantType;
      const fieldMetadata = { id: "GT", number: { type: "NUMBER", count: 1 } } as FieldMetadataWrapper;
      const vcfMetadata = {
        format: { GT: fieldMetadata },
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
      const meta = {
        app: {},
        records: vcfMetadata,
        variantTypeIds: { }
      } as MetadataContainer
      vi.mocked(createQueryVariantType).mockReturnValue(null);
      vi.mocked(createQueryFilters).mockReturnValue(null);

      expect(createQuery(config, meta, variantType, null, filterValues)).toStrictEqual(null);
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
