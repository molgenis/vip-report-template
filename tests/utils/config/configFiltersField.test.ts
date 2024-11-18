import { afterEach, describe, expect, test, vi } from "vitest";
import { SampleContainer, VcfMetadataContainer } from "../../../src/utils/api.ts";
import { initConfigFiltersGenotype, initConfigFiltersInfo } from "../../../src/utils/config/configFiltersField.ts";
import { FieldMetadataWrapper, getInfoFieldsRegex, getSampleFieldsRegex } from "../../../src/utils/vcf.ts";
import { ConfigStaticFieldGenotype, ConfigStaticFieldInfo } from "../../../src/types/config";

describe("config filters field", () => {
  vi.mock(import("../../../src/utils/vcf.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("initConfigFiltersInfo", () => {
    const metadata = {} as VcfMetadataContainer;

    test("config matches one field", () => {
      const config: ConfigStaticFieldInfo = {
        type: "info",
        name: "field",
        label: "my_field_label",
        description: "my_field_description",
      };
      const field = {
        id: "INFO/field",
        label: "field_label",
        description: "field_description",
      } as FieldMetadataWrapper;
      vi.mocked(getInfoFieldsRegex).mockReturnValue([field]);

      const filters = initConfigFiltersInfo(config, metadata);
      expect(filters.length).toStrictEqual(1);
      const filter = filters[0]!;
      expect(filter.type).toStrictEqual("info");
      expect(filter.field).toStrictEqual(field);
      expect(filter.label()).toStrictEqual("my_field_label");
      expect(filter.description()).toStrictEqual("my_field_description");

      expect(getInfoFieldsRegex).toHaveBeenCalledWith(metadata, /^field$/);
    });

    test("config matches multiple fields", () => {
      const config: ConfigStaticFieldInfo = {
        type: "info",
        name: "VIP/.*",
      };
      const fieldVip = {
        id: "INFO/VIP",
        nested: {},
      } as FieldMetadataWrapper;
      const fieldVipField0 = {
        id: "INFO/VIP/field0",
      } as FieldMetadataWrapper;
      const fieldVipField1 = {
        id: "INFO/VIP/field1",
      } as FieldMetadataWrapper;
      vi.mocked(getInfoFieldsRegex).mockReturnValue([fieldVip, fieldVipField0, fieldVipField1]);

      const filters = initConfigFiltersInfo(config, metadata);
      expect(filters.length).toStrictEqual(2); // drop nested fields
      expect(getInfoFieldsRegex).toHaveBeenCalledWith(metadata, /^VIP\/.*$/);
    });

    test("config matches zero fields", () => {
      const config: ConfigStaticFieldInfo = {
        type: "info",
        name: "field_not_in_my_vcf",
      };
      vi.mocked(getInfoFieldsRegex).mockReturnValue([]);

      const filters = initConfigFiltersInfo(config, metadata);
      expect(filters.length).toStrictEqual(0);
      expect(getInfoFieldsRegex).toHaveBeenCalledWith(metadata, /^field_not_in_my_vcf$/);
    });
  });

  describe("initConfigFiltersGenotype", () => {
    const metadata = {} as VcfMetadataContainer;
    const sample = { item: { id: 2 } } as SampleContainer;

    test("config matches one field", () => {
      const config: ConfigStaticFieldGenotype = {
        type: "genotype",
        name: "field",
        label: "my_field_label",
        description: "my_field_description",
      };
      const field = {
        id: "FORMAT/field",
        label: "field_label",
        description: "field_description",
      } as FieldMetadataWrapper;
      vi.mocked(getSampleFieldsRegex).mockReturnValue([field]);

      const filters = initConfigFiltersGenotype(config, metadata, sample);
      expect(filters.length).toStrictEqual(1);
      const filter = filters[0]!;
      expect(filter.type).toStrictEqual("genotype");
      expect(filter.field).toStrictEqual(field);
      expect(filter.label()).toStrictEqual("my_field_label");
      expect(filter.description()).toStrictEqual("my_field_description");

      expect(getSampleFieldsRegex).toHaveBeenCalledWith(metadata, /^field$/);
    });

    test("config matches multiple fields", () => {
      const config: ConfigStaticFieldGenotype = {
        type: "genotype",
        name: "VIP/.*",
      };
      const fieldVip = {
        id: "FORMAT/VIP",
        nested: {},
      } as FieldMetadataWrapper;
      const fieldVipField0 = {
        id: "FORMAT/VIP/field0",
      } as FieldMetadataWrapper;
      const fieldVipField1 = {
        id: "FORMAT/VIP/field1",
      } as FieldMetadataWrapper;
      vi.mocked(getSampleFieldsRegex).mockReturnValue([fieldVip, fieldVipField0, fieldVipField1]);

      const filters = initConfigFiltersGenotype(config, metadata, sample);
      expect(filters.length).toStrictEqual(2); // drop nested fields
      expect(getSampleFieldsRegex).toHaveBeenCalledWith(metadata, /^VIP\/.*$/);
    });

    test("config matches zero fields", () => {
      const config: ConfigStaticFieldGenotype = {
        type: "genotype",
        name: "field_not_in_my_vcf",
      };
      vi.mocked(getSampleFieldsRegex).mockReturnValue([]);

      const filters = initConfigFiltersGenotype(config, metadata, sample);
      expect(filters.length).toStrictEqual(0);
      expect(getSampleFieldsRegex).toHaveBeenCalledWith(metadata, /^field_not_in_my_vcf$/);
    });
  });
});
