import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfigFilters } from "../../../src/utils/config/configFilters.ts";
import { ConfigJsonFilter, ConfigVip } from "../../../src/types/config";
import { MetadataContainer, SampleContainer, VcfMetadataContainer } from "../../../src/utils/api.ts";
import { initConfigFilterFixed } from "../../../src/utils/config/configFiltersFixed.ts";
import { ConfigFilterField, ConfigFilterFixed, ConfigFilterFormat } from "../../../src/types/configFilter";
import { initConfigFilterComposed } from "../../../src/utils/config/configFiltersComposed.ts";
import { initConfigFiltersGenotype, initConfigFiltersInfo } from "../../../src/utils/config/configFiltersField.ts";
import { ConfigFilterComposed } from "../../../src/types/configFilterComposed";

describe("config filters", () => {
  vi.mock(import("../../../src/utils/config/configFiltersComposed.ts"));
  vi.mock(import("../../../src/utils/config/configFiltersField.ts"));
  vi.mock(import("../../../src/utils/config/configFiltersFixed.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  const metadata: Partial<MetadataContainer> = { records: {} as VcfMetadataContainer };
  const sample: Partial<SampleContainer> | null = {};

  describe("initConfigFilters", () => {
    const configVip = {} as ConfigVip;

    test("regular filters config", () => {
      vi.mocked(initConfigFilterFixed).mockReturnValue({ type: "fixed", id: "chrom" } as ConfigFilterFixed);
      vi.mocked(initConfigFiltersInfo).mockReturnValue([
        {
          type: "info",
          id: "my_info",
        } as Partial<ConfigFilterField> as ConfigFilterField,
      ]);
      vi.mocked(initConfigFiltersGenotype).mockReturnValue([
        {
          type: "genotype",
          id: "my_genotype",
        } as Partial<ConfigFilterFormat> as ConfigFilterFormat,
      ]);
      vi.mocked(initConfigFilterComposed).mockReturnValue({
        type: "composed",
        id: "locus",
      } as Partial<ConfigFilterComposed> as ConfigFilterComposed);

      const config: ConfigJsonFilter[] = [
        { type: "fixed", name: "chrom" },
        { type: "info", name: "my_info" },
        { type: "genotype", name: "my_genotype" },
        { type: "composed", name: "locus" },
      ];

      expect(
        initConfigFilters(config, configVip, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual([
        { type: "fixed", id: "fixed/chrom" },
        { type: "info", id: "info/my_info" },
        {
          type: "genotype",
          id: "genotype/my_genotype",
        },
        { type: "composed", id: "composed/locus" },
      ]);
    });

    test("exclude filters that are not applicable", () => {
      vi.mocked(initConfigFiltersInfo).mockReturnValue([]);
      vi.mocked(initConfigFiltersGenotype).mockReturnValue([]);
      vi.mocked(initConfigFilterComposed).mockReturnValue(null);

      const config: ConfigJsonFilter[] = [
        { type: "info", name: "unknown_info" },
        { type: "genotype", name: "unknown_genotype" },
      ];

      expect(
        initConfigFilters(config, configVip, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual([]);
    });
  });
});
