import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfigCells } from "../utils/configCells.ts";
import { ConfigStaticField } from "../types/config";
import { VariantType } from "../utils/variantTypeUtils.ts";
import { MetadataContainer, SampleContainer, VcfMetadataContainer } from "../Api.ts";
import { ConfigCellCustom, ConfigCellFixed, ConfigCellGenotype, ConfigCellInfo } from "../types/configCell";
import { initConfigCellFixed } from "../utils/configCellsFixed.ts";
import { initConfigCellGenotype, initConfigCellInfo } from "../utils/configCellsField.ts";
import { initConfigCellComposed } from "../utils/configCellsComposed.ts";
import { CellValueCustom } from "../types/configCellComposed";

describe("config cells", () => {
  vi.mock("../utils/configCellsComposed");
  vi.mock("../utils/configCellsField");
  vi.mock("../utils/configCellsFixed");

  afterEach(() => {
    vi.resetAllMocks();
  });

  const variantType: Partial<VariantType> = { id: "snv" };
  const recordsMetadata: Partial<VcfMetadataContainer> = { fieldMap: {} };
  const metadata: Partial<MetadataContainer> = { records: recordsMetadata as VcfMetadataContainer };

  describe("initConfigCells", () => {
    test("regular cells config", () => {
      vi.mocked(initConfigCellFixed).mockReturnValue(0 as unknown as ConfigCellFixed);
      vi.mocked(initConfigCellInfo).mockReturnValue([1 as unknown as ConfigCellInfo]);
      vi.mocked(initConfigCellGenotype).mockReturnValue([2 as unknown as ConfigCellGenotype]);
      vi.mocked(initConfigCellComposed).mockReturnValue(3 as unknown as ConfigCellCustom<CellValueCustom>);

      const config: ConfigStaticField[] = [
        { type: "fixed", name: "chrom" },
        { type: "info", name: "my_info" },
        {
          type: "group",
          fields: [
            { type: "genotype", name: "my_genotype" },
            { type: "composed", name: "my_composed" },
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

      const config: ConfigStaticField[] = [
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

    test("error on genotype cell config when no sample available", () => {
      const config: ConfigStaticField[] = [{ type: "genotype", name: "my_genotype_not_in_metadata" }];
      const sample: Partial<SampleContainer> | null = null;

      expect(() =>
        initConfigCells(config, variantType as VariantType, metadata as MetadataContainer, sample),
      ).toThrowError(/^config invalid: cannot create field, field type 'genotype' requires sample$/);
    });
  });
});
