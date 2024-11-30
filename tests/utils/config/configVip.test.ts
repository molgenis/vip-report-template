import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfigVip } from "../../../src/utils/config/configVip.ts";
import { ConfigJsonVip, ConfigJsonVipParams } from "../../../src/types/config";
import { MetadataContainer, VcfMetadataContainer } from "../../../src/utils/api.ts";
import { FieldMetadataWrapper, getSampleField } from "../../../src/utils/vcf.ts";

describe("config vip", () => {
  vi.mock(import("../../../src/utils/vcf.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("initConfigVip", () => {
    const vcfMetadata = {};
    const metadata: Partial<MetadataContainer> = { records: vcfMetadata as VcfMetadataContainer };
    const params = { vcf: {} } as ConfigJsonVipParams;
    const config: ConfigJsonVip = {
      filter_field: { type: "genotype", name: "f" },
      params,
    };

    test("init", () => {
      const fieldMetadata = { id: "f", type: "CATEGORICAL" } as FieldMetadataWrapper;
      vi.mocked(getSampleField).mockReturnValue(fieldMetadata);

      expect(initConfigVip(config, metadata as MetadataContainer)).toStrictEqual({
        filter_field: fieldMetadata,
        params,
      });
      expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "f");
    });

    test("init metadata invalid", () => {
      const fieldMetadata = { id: "f", type: "INTEGER" } as FieldMetadataWrapper;
      vi.mocked(getSampleField).mockReturnValue(fieldMetadata);

      expect(() => initConfigVip(config, metadata as MetadataContainer)).toThrowError(
        /^config invalid: property 'vip.filter_field.name' value 'f' is of type INTEGER instead of CATEGORICAL$/,
      );
      expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "f");
    });

    test("init metadata unavailable", () => {
      vi.mocked(getSampleField).mockReturnValue(undefined);

      expect(initConfigVip(config, metadata as MetadataContainer)).toStrictEqual({
        filter_field: null,
        params,
      });
    });
  });
});
