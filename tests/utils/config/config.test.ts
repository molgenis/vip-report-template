import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfig } from "../../../src/utils/config/config.ts";
import {
  ConfigJson,
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
      {
        number: 10,
        selected: true,
      },
      { number: 20 },
      { number: 50 },
      { number: 100 },
    ];

    test("regular config", () => {
      vi.mocked(initConfigVip).mockReturnValue(0 as unknown as ConfigVip);
      vi.mocked(initConfigCells).mockReturnValue([1 as unknown as ConfigCell]);
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
      };
      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual({
        vip: 0,
        variants: { cells: [1], filters: [2], sorts: [3], recordsPerPage },
      });
    });

    test("minimal config", () => {
      vi.mocked(initConfigVip).mockReturnValue(0 as unknown as ConfigVip);
      vi.mocked(initConfigCells).mockReturnValue([1 as unknown as ConfigCell]);

      const config: ConfigJson = {
        vip: { params: {} } as ConfigJsonVip,
        sample_variants: {} as ConfigJsonVariants,
        variants: configVariantsMinimal,
      };

      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual({ vip: 0, variants: { cells: [1], filters: [], sorts: [], recordsPerPage: recordsPerPageBase } });
      expect(initConfigFilters).toBeCalledTimes(0);
      expect(initConfigSorts).toBeCalledTimes(0);
    });

    test("throws error on empty config property 'cells.all'", () => {
      const config: ConfigJson = {
        vip: { params: {} } as ConfigJsonVip,
        sample_variants: { cells: { all: [] } },
        variants: { cells: { all: [] } },
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
      };
      const variantType: Partial<VariantType> = { id: "all" };

      expect(() =>
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toThrow(/^config invalid: missing required property 'cells.all'$/);
    });
  });
});
