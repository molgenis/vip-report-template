import { MetadataContainer, VcfMetadataContainer } from "../../../src/utils/api.ts";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ConfigStaticSort } from "../../../src/types/config";
import { initConfigSorts } from "../../../src/utils/config/configSorts.ts";
import { FieldMetadataWrapper, getInfoField } from "../../../src/utils/vcf.ts";

describe("initConfigSorts", () => {
  vi.mock(import("../../../src/utils/vcf.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  const vcfMetadata = {};
  const metadata: Partial<MetadataContainer> = { records: vcfMetadata as VcfMetadataContainer };

  test("regular sorts config", () => {
    const fieldMetadata = { id: "f" } as FieldMetadataWrapper;
    const config: ConfigStaticSort[] = [
      {
        selected: true,
        orders: [{ direction: "desc", field: { type: "info", name: "f" } }],
      },
    ];
    vi.mocked(getInfoField).mockReturnValue(fieldMetadata);

    expect(initConfigSorts(config, metadata as MetadataContainer)).toStrictEqual([
      {
        orders: [
          {
            direction: "desc",
            field: {
              id: "f",
            },
          },
        ],
        selected: true,
      },
    ]);
    expect(getInfoField).toHaveBeenCalledWith(vcfMetadata, "f");
  });

  test("undefined sort field", () => {
    const config: ConfigStaticSort[] = [
      {
        selected: true,
        orders: [{ direction: "desc", field: { type: "info", name: "f_unknown" } }],
      },
    ];
    vi.mocked(getInfoField).mockReturnValue(undefined);

    expect(initConfigSorts(config, metadata as MetadataContainer)).toStrictEqual([]);
    expect(getInfoField).toHaveBeenCalledWith(vcfMetadata, "f_unknown");
  });
});
