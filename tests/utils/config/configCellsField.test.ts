import { afterEach, describe, expect, test, vi } from "vitest";
import { SampleContainer, VcfMetadataContainer } from "../../../src/utils/api.ts";
import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { initConfigCellGenotype, initConfigCellInfo } from "../../../src/utils/config/configCellsField.ts";
import {
  FieldMetadataWrapper,
  getInfoFieldsRegex,
  getInfoValue,
  getInfoValueCount,
  getSampleFieldsRegex,
  getSampleValue,
  getSampleValueCount,
} from "../../../src/utils/vcf.ts";
import { ConfigJsonFieldGenotype, ConfigJsonFieldInfo } from "../../../src/types/config";

describe("config cells field", () => {
  vi.mock(import("../../../src/utils/vcf.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("initConfigCellInfo", () => {
    const metadata = {} as VcfMetadataContainer;
    const record = { id: 0, data: { c: "chr1", p: 123, r: "A", a: ["C", "T"] } } as Item<VcfRecord>;

    test("config matches one field", () => {
      const config: ConfigJsonFieldInfo = {
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
      vi.mocked(getInfoValueCount).mockReturnValue(1);
      vi.mocked(getInfoValue).mockReturnValue(0);

      const cells = initConfigCellInfo(config, metadata);
      expect(cells.length).toStrictEqual(1);
      const cell = cells[0]!;
      expect(cell.type).toStrictEqual("info");
      expect(cell.field).toStrictEqual(field);
      expect(cell.label()).toStrictEqual("my_field_label");
      expect(cell.description()).toStrictEqual("my_field_description");
      expect(cell.valueCount(record)).toStrictEqual(1);
      expect(cell.value(record, 1)).toStrictEqual(0);

      expect(getInfoFieldsRegex).toHaveBeenCalledWith(metadata, /^field$/);
      expect(getInfoValueCount).toHaveBeenCalledWith(record, field);
      expect(getInfoValue).toHaveBeenCalledWith(record, 1, field);
    });

    test("config matches multiple fields", () => {
      const config: ConfigJsonFieldInfo = {
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

      const cells = initConfigCellInfo(config, metadata);
      expect(cells.length).toStrictEqual(2); // drop nested fields
      expect(getInfoFieldsRegex).toHaveBeenCalledWith(metadata, /^VIP\/.*$/);
    });

    test("config matches zero fields", () => {
      const config: ConfigJsonFieldInfo = {
        type: "info",
        name: "field_not_in_my_vcf",
      };
      vi.mocked(getInfoFieldsRegex).mockReturnValue([]);

      const cells = initConfigCellInfo(config, metadata);
      expect(cells.length).toStrictEqual(0);
      expect(getInfoFieldsRegex).toHaveBeenCalledWith(metadata, /^field_not_in_my_vcf$/);
    });
  });

  describe("initConfigCellGenotype", () => {
    const metadata = {} as VcfMetadataContainer;
    const sample = { item: { id: 2 } } as SampleContainer;
    const record = { id: 0, data: { c: "chr1", p: 123, r: "A", a: ["C", "T"] } } as Item<VcfRecord>;

    test("config matches one field", () => {
      const config: ConfigJsonFieldGenotype = {
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
      vi.mocked(getSampleValueCount).mockReturnValue(1);
      vi.mocked(getSampleValue).mockReturnValue(0);

      const cells = initConfigCellGenotype(config, metadata, sample);
      expect(cells.length).toStrictEqual(1);
      const cell = cells[0]!;
      expect(cell.type).toStrictEqual("genotype");
      expect(cell.field).toStrictEqual(field);
      expect(cell.label()).toStrictEqual("my_field_label");
      expect(cell.description()).toStrictEqual("my_field_description");
      expect(cell.valueCount(record)).toStrictEqual(1);
      expect(cell.value(record, 1)).toStrictEqual(0);

      expect(getSampleFieldsRegex).toHaveBeenCalledWith(metadata, /^field$/);
      expect(getSampleValueCount).toHaveBeenCalledWith(sample, record, field);
      expect(getSampleValue).toHaveBeenCalledWith(sample, record, 1, field);
    });

    test("config matches multiple fields", () => {
      const config: ConfigJsonFieldGenotype = {
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

      const cells = initConfigCellGenotype(config, metadata, sample);
      expect(cells.length).toStrictEqual(2); // drop nested fields
      expect(getSampleFieldsRegex).toHaveBeenCalledWith(metadata, /^VIP\/.*$/);
    });

    test("config matches zero fields", () => {
      const config: ConfigJsonFieldGenotype = {
        type: "genotype",
        name: "field_not_in_my_vcf",
      };
      vi.mocked(getSampleFieldsRegex).mockReturnValue([]);

      const cells = initConfigCellGenotype(config, metadata, sample);
      expect(cells.length).toStrictEqual(0);
      expect(getSampleFieldsRegex).toHaveBeenCalledWith(metadata, /^field_not_in_my_vcf$/);
    });
  });
});
