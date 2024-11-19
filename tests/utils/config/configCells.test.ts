import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfigCells } from "../../../src/utils/config/configCells.ts";
import { ConfigJsonField } from "../../../src/types/config";
import { VariantType } from "../../../src/utils/variantType.ts";
import { MetadataContainer, SampleContainer, VcfMetadataContainer } from "../../../src/utils/api.ts";
import { ConfigCellCustom, ConfigCellFixed, ConfigCellGenotype, ConfigCellInfo } from "../../../src/types/configCells";
import { initConfigCellFixed } from "../../../src/utils/config/configCellsFixed.ts";
import { initConfigCellGenotype, initConfigCellInfo } from "../../../src/utils/config/configCellsField.ts";
import { initConfigCellComposed } from "../../../src/utils/config/configCellsComposed.ts";
import { CellValueCustom } from "../../../src/types/configCellComposed";

describe("config cells", () => {
  vi.mock(import("../../../src/utils/config/configCellsComposed.ts"));
  vi.mock(import("../../../src/utils/config/configCellsField.ts"));
  vi.mock(import("../../../src/utils/config/configCellsFixed.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  const variantType: Partial<VariantType> = { id: "snv" };
  const metadata: Partial<MetadataContainer> = { records: {} as VcfMetadataContainer };

  describe("initConfigCells", () => {
    test("regular cells config", () => {
      vi.mocked(initConfigCellFixed).mockReturnValue(0 as unknown as ConfigCellFixed);
      vi.mocked(initConfigCellInfo).mockReturnValue([1 as unknown as ConfigCellInfo]);
      vi.mocked(initConfigCellGenotype).mockReturnValue([2 as unknown as ConfigCellGenotype]);
      vi.mocked(initConfigCellComposed).mockReturnValue(3 as unknown as ConfigCellCustom<CellValueCustom>);

      const config: ConfigJsonField[] = [
        { type: "fixed", name: "chrom" },
        { type: "info", name: "my_info" },
        {
          type: "group",
          fields: [
            { type: "genotype", name: "my_genotype" },
            { type: "composed", name: "locus" },
          ],
        },
      ];
      const sample: Partial<SampleContainer> | null = {};

      expect(
        initConfigCells(
          config,
          variantType as VariantType,
          metadata as MetadataContainer,
          sample as SampleContainer | null,
        ),
      ).toStrictEqual([0, 1, { type: "group", fieldConfigs: [2, 3] }]);
    });

    test("empty item and group", () => {
      vi.mocked(initConfigCellInfo).mockReturnValue([]);
      vi.mocked(initConfigCellGenotype).mockReturnValue([]);

      const config: ConfigJsonField[] = [
        { type: "info", name: "my_info_not_in_metadata" },
        {
          type: "group",
          fields: [{ type: "genotype", name: "my_genotype_not_in_metadata" }],
        },
      ];
      const sample: Partial<SampleContainer> | null = {};

      expect(
        initConfigCells(
          config,
          variantType as VariantType,
          metadata as MetadataContainer,
          sample as SampleContainer | null,
        ),
      ).toStrictEqual([]);
    });

    test("ignore genotype cell config when no sample available", () => {
      const config: ConfigJsonField[] = [{ type: "genotype", name: "my_genotype_not_in_metadata" }];
      const sample: Partial<SampleContainer> | null = null;

      expect(initConfigCells(config, variantType as VariantType, metadata as MetadataContainer, sample)).toStrictEqual(
        [],
      );
    });
  });
});
