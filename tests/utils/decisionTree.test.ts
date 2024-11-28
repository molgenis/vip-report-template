import { afterEach, describe, expect, test, vi } from "vitest";
import { getDecisionTreePath, getSampleTreePath } from "../../src/utils/decisionTree.ts";
import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { SampleContainer, VcfMetadataContainer } from "../../src/utils/api.ts";
import {
  FieldMetadataWrapper,
  getInfoNestedField,
  getInfoValue,
  getSampleField,
  getSampleValue,
} from "../../src/utils/vcf.ts";

describe("decision tree", () => {
  vi.mock(import("../../src/utils/vcf.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  const vcfMetadata = {} as VcfMetadataContainer;
  const record: Item<VcfRecord> = {
    data: {
      c: "chr1",
      p: 123,
    },
  } as Partial<Item<Partial<VcfRecord>>> as Item<VcfRecord>;

  describe("getDecisionTreePath", () => {
    test("get", () => {
      const fieldMetadata = {
        id: "VIPP",
        parent: { id: "CSQ" },
      } as FieldMetadataWrapper;

      vi.mocked(getInfoNestedField).mockReturnValue(fieldMetadata);
      vi.mocked(getInfoValue).mockReturnValue("a&b&c");
      expect(getDecisionTreePath(vcfMetadata, record, 2)).toStrictEqual("a&b&c");
      expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "VIPP");
      expect(getInfoValue).toHaveBeenCalledWith(record, 2, fieldMetadata);
    });

    test("get, no metadata", () => {
      vi.mocked(getInfoNestedField).mockReturnValue(undefined);
      expect(getDecisionTreePath(vcfMetadata, record, 2)).toStrictEqual([]);
      expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "VIPP");
    });
  });

  describe("getSampleTreePath", () => {
    const sample = { item: { id: 0 } } as SampleContainer;

    test("get", () => {
      const fieldMetadata = {
        id: "VIPP_S",
      } as FieldMetadataWrapper;

      vi.mocked(getSampleField).mockReturnValue(fieldMetadata);
      vi.mocked(getSampleValue).mockReturnValue(["a&b&c", "d&e&f"]);
      expect(getSampleTreePath(vcfMetadata, sample, record, 1)).toStrictEqual(["d", "e", "f"]);
      expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIPP_S");
      expect(getSampleValue).toHaveBeenCalledWith(sample, record, -1, fieldMetadata);
    });

    test("get, no metadata", () => {
      vi.mocked(getSampleField).mockReturnValue(undefined);
      expect(getSampleTreePath(vcfMetadata, sample, record, 1)).toStrictEqual([]);
      expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIPP_S");
    });
  });
});
