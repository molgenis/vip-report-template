import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfig } from "../../../src/utils/config/config.ts";
import { ConfigStatic, ConfigStaticVariants, ConfigStaticVip, ConfigVip } from "../../../src/types/config";
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

  const configVariantsMinimal: ConfigStaticVariants = {
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
    test("regular config", () => {
      vi.mocked(initConfigVip).mockReturnValue(0 as unknown as ConfigVip);
      vi.mocked(initConfigCells).mockReturnValue([1 as unknown as ConfigCell]);
      vi.mocked(initConfigFilters).mockReturnValue([2 as unknown as ConfigFilter]);
      vi.mocked(initConfigSorts).mockReturnValue([3 as unknown as ConfigSort]);

      const config: ConfigStatic = {
        vip: { params: {} } as ConfigStaticVip,
        sample_variants: {} as ConfigStaticVariants,
        variants: {
          ...configVariantsMinimal,
          filters: { all: [] },
          sorts: { all: [] },
        },
      };
      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual({ vip: 0, variants: { cells: [1], filters: [2], sorts: [3] } });
    });

    test("minimal config", () => {
      vi.mocked(initConfigVip).mockReturnValue(0 as unknown as ConfigVip);
      vi.mocked(initConfigCells).mockReturnValue([1 as unknown as ConfigCell]);

      const config: ConfigStatic = {
        vip: { params: {} } as ConfigStaticVip,
        sample_variants: {} as ConfigStaticVariants,
        variants: configVariantsMinimal,
      };

      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toStrictEqual({ vip: 0, variants: { cells: [1], filters: [], sorts: [] } });
      expect(initConfigFilters).toBeCalledTimes(0);
      expect(initConfigSorts).toBeCalledTimes(0);
    });

    test("throws error on missing config property 'variants'", () => {
      const config = { vip: { params: {} } as ConfigStaticVip } as ConfigStatic;
      const variantType: Partial<VariantType> = { id: "all" };
      expect(() =>
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toThrow(/^config invalid: missing required property 'variants'$/);
    });

    test("throws error on missing config property 'sample_variants'", () => {
      const config = { vip: { params: {} } as ConfigStaticVip } as ConfigStatic;
      const variantType = { id: "all" } as VariantType;
      const sample = {} as SampleContainer;
      expect(() => initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample)).toThrow(
        /^config invalid: missing required property 'sample_variants'$/,
      );
    });

    test("throws error on empty config property 'cells.all'", () => {
      const config: ConfigStatic = {
        vip: { params: {} } as ConfigStaticVip,
        sample_variants: { cells: { all: [] } },
        variants: { cells: { all: [] } },
      };
      const variantType: Partial<VariantType> = { id: "all" };

      expect(() =>
        initConfig(config, variantType as VariantType, metadata as MetadataContainer, sample as SampleContainer | null),
      ).toThrow(/^config invalid: property 'cells.all' requires at least one value$/);
    });

    test("throws error on missing config property 'cells.all'", () => {
      const config: ConfigStatic = {
        vip: { params: {} } as ConfigStaticVip,
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
