import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfig } from "../../../src/utils/config/config.ts";
import {
  ConfigJson,
  ConfigJsonVariant,
  ConfigJsonVariantConsequence,
  ConfigJsonVariants,
  ConfigJsonVip,
  ConfigRecordsPerPage,
  ConfigVip,
} from "../../../src/types/config";
import { MetadataContainer, SampleContainer } from "../../../src/utils/api.ts";
import { VariantType } from "../../../src/utils/variantType.ts";
import { initConfigCells } from "../../../src/utils/config/configCells.ts";
import { initConfigFilters } from "../../../src/utils/config/configFilters.ts";
import { initConfigSorts } from "../../../src/utils/config/configSorts.ts";
import { ConfigCell } from "../../../src/types/configCells";
import { ConfigFilter } from "../../../src/types/configFilter";
import { ConfigSort } from "../../../src/types/configSort";
import { initConfigVip } from "../../../src/utils/config/configVip.ts";

describe("config", () => {
  vi.mock(import("../../../src/utils/config/configCells.ts"));
  vi.mock(import("../../../src/utils/config/configFilters.ts"));
  vi.mock(import("../../../src/utils/config/configSorts.ts"));
  vi.mock(import("../../../src/utils/config/configVip.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  const configVariantsMinimal: ConfigJsonVariants = {
    cells: {
      all: [
        {
          type: "fixed",
          name: "chrom",
        },
      ],
    },
  };
  const metadata: Partial<MetadataContainer> = {};
  const sample: Partial<SampleContainer> | null = null;

  describe("initConfig", () => {
    const recordsPerPageBase = [
      { number: 10 },
      { number: 20,
        selected: true,
      },
      { number: 50 },
      { number: 100 },
    ];

    test("regular config", () => {
      vi.mocked(initConfigVip).mockReturnValue(0 as unknown as ConfigVip);
      vi.mocked(initConfigCells)
        .mockReturnValueOnce([4 as unknown as ConfigCell])
        .mockReturnValueOnce([5 as unknown as ConfigCell])
        .mockReturnValue([-1 as unknown as ConfigCell]);
      vi.mocked(initConfigFilters).mockReturnValue([2 as unknown as ConfigFilter]);
      vi.mocked(initConfigSorts).mockReturnValue([3 as unknown as ConfigSort]);

      const recordsPerPage: ConfigRecordsPerPage = [{ number: 1 }, { number: 2, selected: true }, { number: 3 }];

      const config: ConfigJson = {
        vip: { params: {} } as ConfigJsonVip,
        sample_variants: {} as ConfigJsonVariants,
        variants: {
          ...configVariantsMinimal,
          filters: { all: [] },
          sorts: { all: [] },
          recordsPerPage: { all: recordsPerPage },
        },
        sample_variant: { cells: { all: [{}] } } as ConfigJsonVariant,
        variant: { cells: { all: [{}] } } as ConfigJsonVariant,
        sample_variant_consequence: { samples_cells: { all: [{}] } } as ConfigJsonVariantConsequence,
        variant_consequence: { sample_cells: { all: [{}] } } as ConfigJsonVariantConsequence,
      };
      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual({
        vip: 0,
        variants: { cells: [4], filters: [2], sorts: [3], recordsPerPage },
        variant: {
          cells: [5],
          samplesCells: undefined,
        },
        variantConsequence: {
          samplesCells: undefined,
        },
      });
    });

    test("minimal config", () => {
      vi.mocked(initConfigVip).mockReturnValue(0 as unknown as ConfigVip);
      vi.mocked(initConfigCells)
        .mockReturnValueOnce([1 as unknown as ConfigCell])
        .mockReturnValueOnce([2 as unknown as ConfigCell]);

      const config: ConfigJson = {
        vip: { params: {} } as ConfigJsonVip,
        sample_variants: {} as ConfigJsonVariants,
        variants: configVariantsMinimal,
        sample_variant: {} as ConfigJsonVariant,
        variant: configVariantsMinimal,
        sample_variant_consequence: {} as ConfigJsonVariantConsequence,
        variant_consequence: {} as ConfigJsonVariantConsequence,
      };

      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual({
        vip: 0,
        variants: { cells: [1], filters: [], sorts: [], recordsPerPage: recordsPerPageBase },
        variant: {
          cells: [2],
          samplesCells: undefined,
        },
        variantConsequence: {
          samplesCells: undefined,
        },
      });
      expect(initConfigFilters).toBeCalledTimes(0);
      expect(initConfigSorts).toBeCalledTimes(0);
    });

    test("throws error on empty config property 'cells.all'", () => {
      const config: ConfigJson = {
        vip: { params: {} } as ConfigJsonVip,
        sample_variants: { cells: { all: [] } },
        variants: { cells: { all: [] } },
        sample_variant: {} as ConfigJsonVariant,
        variant: {} as ConfigJsonVariant,
        sample_variant_consequence: {} as ConfigJsonVariantConsequence,
        variant_consequence: {} as ConfigJsonVariantConsequence,
      };
      const variantType: Partial<VariantType> = { id: "all" };

      expect(() =>
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toThrow(/^config invalid: property 'cells.all' requires at least one value$/);
    });

    test("throws error on missing config property 'cells.all'", () => {
      const config: ConfigJson = {
        vip: { params: {} } as ConfigJsonVip,
        sample_variants: { cells: { all: [] } },
        variants: { cells: {} },
        sample_variant: {} as ConfigJsonVariant,
        variant: {} as ConfigJsonVariant,
        sample_variant_consequence: {} as ConfigJsonVariantConsequence,
        variant_consequence: {} as ConfigJsonVariantConsequence,
      };
      const variantType: Partial<VariantType> = { id: "all" };

      expect(() =>
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toThrow(/^config invalid: missing required property 'cells.all'$/);
    });
  });
});
