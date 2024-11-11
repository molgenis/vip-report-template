import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfigVariants } from "../utils/config.ts";
import { ConfigStaticVariants } from "../types/config";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { VariantType } from "../utils/variantTypeUtils.ts";
import { initConfigFields } from "../utils/configFields";
import { initConfigFilters } from "../utils/configFilters";
import { initConfigSorts } from "../utils/configSorts";
import { ConfigCell } from "../types/configCell";
import { ConfigFilter } from "../types/configFilter";
import { ConfigSort } from "../types/configSort";

describe("config", () => {
  vi.mock("../utils/configFields");
  vi.mock("../utils/configFilters");
  vi.mock("../utils/configSorts");

  afterEach(() => {
    vi.resetAllMocks();
  });

  const configMinimal: ConfigStaticVariants = {
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

  describe("initConfigVariants", () => {
    test("regular config", () => {
      vi.mocked(initConfigFields).mockReturnValue([0 as unknown as ConfigCell]);
      vi.mocked(initConfigFilters).mockReturnValue([1 as unknown as ConfigFilter]);
      vi.mocked(initConfigSorts).mockReturnValue([2 as unknown as ConfigSort]);

      const config: ConfigStaticVariants = { ...configMinimal, filters: { all: [] }, sorts: { all: [] } };
      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfigVariants(
          config,
          variantType as VariantType,
          metadata as MetadataContainer,
          sample as SampleContainer | null,
        ),
      ).toStrictEqual({ cells: [0], filters: [1], sorts: [2] });
    });

    test("minimal config", () => {
      vi.mocked(initConfigFields).mockReturnValue([0 as unknown as ConfigCell]);

      const variantType: Partial<VariantType> = { id: "snv" };

      expect(
        initConfigVariants(
          configMinimal,
          variantType as VariantType,
          metadata as MetadataContainer,
          sample as SampleContainer | null,
        ),
      ).toStrictEqual({ cells: [0], filters: [], sorts: [] });
      expect(initConfigFilters).toBeCalledTimes(0);
      expect(initConfigSorts).toBeCalledTimes(0);
    });

    test("throws error on empty configBase property 'cells.all'", () => {
      const config: ConfigStaticVariants = { cells: { all: [] } };
      const variantType: Partial<VariantType> = { id: "all" };

      expect(() =>
        initConfigVariants(
          config,
          variantType as VariantType,
          metadata as MetadataContainer,
          sample as SampleContainer | null,
        ),
      ).toThrow(/^config invalid: property 'cells.all' requires at least one value$/);
    });

    test("throws error on missing configBase property 'cells.all'", () => {
      const config: ConfigStaticVariants = { cells: {} };
      const variantType: Partial<VariantType> = { id: "all" };

      expect(() =>
        initConfigVariants(
          config,
          variantType as VariantType,
          metadata as MetadataContainer,
          sample as SampleContainer | null,
        ),
      ).toThrow(/^config invalid: missing required property 'cells.all'$/);
    });
  });
});
