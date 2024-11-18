import { describe, expect, test } from "vitest";
import {
  createFieldMap,
  FieldMetadataWrapper,
  getHeaderValue,
  getInfoField,
  getInfoFields,
  getInfoFieldsRegex,
  getInfoValue,
  getInfoValueCount,
  getInfoValues,
  getSampleFieldsRegex,
  getSampleValue,
  getSampleValueCount,
  getSampleValues,
  isNumerical,
  parseContigIds,
} from "../../src/utils/vcf.ts";
import { abbreviateHeader } from "../../src/utils/utils.ts";
import { FieldMetadata, VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { SampleContainer, VcfMetadataContainer } from "../../src/utils/api.ts";

describe("vcf", () => {
  const recordBase = {
    id: 0,
    data: {
      c: "chr1",
      p: 0,
      i: [],
      r: "A",
      a: ["C", "T"],
      q: null,
      f: [],
      n: {},
      s: [],
    },
  } as Item<VcfRecord>;

  describe("getInfoValue", () => {
    test("field count=1", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: 1 } } };
      const fieldMetadata = { id: "f", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(1);
    });

    test("field count=1 value=null", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: null } } };
      const fieldMetadata = { id: "f", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(null);
    });

    test("field count=1 value=undefined", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: {} } };
      const fieldMetadata = { id: "f", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(null); // treat null and undefined the same
    });

    test("field categorical count=1", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: "cat1" } } };
      const fieldMetadata = {
        id: "f",
        type: "CATEGORICAL",
        categories: { cat1: { label: "my_label", description: "my_description" } },
        number: { type: "NUMBER", count: 1 },
        index: 0,
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual({
        value: "cat1",
        label: "my_label",
        description: "my_description",
      });
    });

    test("field categorical count=1 value=null", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: null } } };
      const fieldMetadata = {
        id: "f",
        type: "CATEGORICAL",
        categories: { cat1: { label: "my_label", description: "my_description" } },
        number: { type: "NUMBER", count: 1 },
        index: 0,
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(null);
    });

    test("field categorical count=1 value=undefined", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: {} } };
      const fieldMetadata = {
        id: "f",
        type: "CATEGORICAL",
        categories: { cat1: { label: "my_label", description: "my_description" } },
        number: { type: "NUMBER", count: 1 },
        index: 0,
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(null);
    });

    test("field categorical count=1 value=null nullValue", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: null } } };
      const fieldMetadata = {
        id: "f",
        type: "CATEGORICAL",
        categories: { cat1: { label: "my_label", description: "my_description" } },
        nullValue: {
          label: "False",
          description: "Null as false",
        },
        number: { type: "NUMBER", count: 1 },
        index: 0,
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual({
        value: null,
        label: "False",
        description: "Null as false",
      });
    });

    test("field count=*", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: [1] } } };
      const fieldMetadata = { id: "f", number: {} } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([1]);
    });

    test("field count=* value=empty", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: [] } } };
      const fieldMetadata = { id: "f", number: {} } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([]);
    });

    test("field count=* value=undefined", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: {} } };
      const fieldMetadata = { id: "f", number: {} } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([]); // treat null and undefined the same
    });

    test("field categorical count=* value=null", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: [] } } };
      const fieldMetadata = {
        id: "f",
        type: "CATEGORICAL",
        categories: {},
        number: { type: "OTHER" },
        index: 0,
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([]);
    });

    test("field categorical count=* value=null nullValue", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: [] } } };
      const fieldMetadata = {
        id: "f",
        type: "CATEGORICAL",
        categories: {},
        nullValue: {
          label: "False",
          description: "Null as false",
        },
        number: { type: "OTHER" },
        index: 0,
      } as FieldMetadataWrapper;
      // empty categorical array value should return array with nullValue
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([
        {
          value: null,
          label: "False",
          description: "Null as false",
        },
      ]);
    });

    test("field child count=1, parent count=1", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: [0, 1, 2, 3] } } };
      const fieldMetadata = {
        id: "f_child",
        number: { count: 1 },
        index: 2,
        parent: { id: "f", number: { count: 1 } },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(2);
    });

    test("field child count=1, parent count=1 value=undefined", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: {} } };
      const fieldMetadata = {
        id: "f_child",
        number: { count: 1 },
        index: 2,
        parent: { id: "f", number: { count: 1 } },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(null);
    });

    test("field child count=*, parent count=1", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: [0, 1, [2, 3], 4] } } };
      const fieldMetadata = {
        id: "f_child",
        number: {},
        index: 2,
        parent: { id: "f", number: { count: 1 } },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([2, 3]);
    });

    test("field child count=*, parent count=1 value=undefined", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: {} } };
      const fieldMetadata = {
        id: "f_child",
        number: {},
        index: 2,
        parent: { id: "f", number: { count: 1 } },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([]);
    });

    test("field child count=1, parent count=*", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          n: {
            f: [
              [0, 1, 2],
              [3, 4, 5],
              [6, 7, 8],
            ],
          },
        },
      };
      const fieldMetadata = {
        id: "f_child",
        number: { count: 1 },
        index: 1,
        parent: { id: "f", number: {} },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(1);
      expect(getInfoValue(record, 1, fieldMetadata)).toStrictEqual(4);
      expect(getInfoValue(record, 2, fieldMetadata)).toStrictEqual(7);
    });

    test("field child count=1, parent count=* value=undefined", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: {} } };
      const fieldMetadata = {
        id: "f_child",
        number: { count: 1 },
        index: 2,
        parent: { id: "f", number: {} },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(null);
    });

    test("field child count=*, parent count=*", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          n: {
            f: [
              [0, ["1a", "1b"], 2],
              [3, ["4a", "4b"], 5],
              [6, ["7a", "7b"], 8],
            ],
          },
        },
      };
      const fieldMetadata = {
        id: "f_child",
        number: {},
        index: 1,
        parent: { id: "f", number: {} },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual(["1a", "1b"]);
      expect(getInfoValue(record, 1, fieldMetadata)).toStrictEqual(["4a", "4b"]);
      expect(getInfoValue(record, 2, fieldMetadata)).toStrictEqual(["7a", "7b"]);
    });

    test("field child count=*, parent count=* value=undefined", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: {} } };
      const fieldMetadata = {
        id: "f_child",
        number: {},
        index: 2,
        parent: { id: "f", number: {} },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([]);
    });

    test("field child count=*, parent count=* categorical", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          n: {
            f: [
              [0, ["cat1", "cat2"], 2],
              [3, ["cat1", null], 5],
              [6, [], 8],
            ],
          },
        },
      };
      const fieldMetadata = {
        id: "f_child",
        type: "CATEGORICAL",
        categories: {
          cat1: { label: "my_label1", description: "my_description1" },
          cat2: { label: "my_label2", description: "my_description2" },
        },
        number: { type: "OTHER" },
        index: 1,
        parent: { id: "f", type: "STRING", number: { type: "OTHER" } },
      } as FieldMetadataWrapper;
      expect(getInfoValue(record, 0, fieldMetadata)).toStrictEqual([
        {
          value: "cat1",
          label: "my_label1",
          description: "my_description1",
        },
        {
          value: "cat2",
          label: "my_label2",
          description: "my_description2",
        },
      ]);
      expect(getInfoValue(record, 1, fieldMetadata)).toStrictEqual([
        {
          value: "cat1",
          label: "my_label1",
          description: "my_description1",
        },
        null,
      ]);
      expect(getInfoValue(record, 2, fieldMetadata)).toStrictEqual([]);
    });
  });

  describe("getInfoValues", () => {
    test("multiple fields", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f0: 0, f1: 1 } } };
      const field0Metadata = { id: "f0", number: { count: 1 } } as FieldMetadataWrapper;
      const field1Metadata = { id: "f1", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getInfoValues(record, 0, field0Metadata, field1Metadata)).toStrictEqual([0, 1]);
    });

    test("undefined fields", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f0: 0 } } };
      const field0Metadata = { id: "f0", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getInfoValues(record, 0, undefined, field0Metadata)).toStrictEqual([undefined, 0]);
    });
  });

  describe("getSampleValue", () => {
    const sample = { item: { data: { index: 1 } } } as SampleContainer;

    test("field", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          s: [{ f0: 0 }, { f0: 1 }],
        },
      };
      const field0Metadata = { id: "f0", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getSampleValue(sample, record, 0, field0Metadata)).toStrictEqual(1);
    });

    test("field undefined", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          s: [{}, {}],
        },
      };
      expect(getSampleValue(sample, record, 0, undefined)).toStrictEqual(undefined);
    });
  });

  describe("getSampleValues", () => {
    const sample = { item: { data: { index: 1 } } } as SampleContainer;

    test("multiple fields", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          s: [
            { f0: 0, f1: 1 },
            { f0: 2, f1: 3 },
          ],
        },
      };
      const field0Metadata = { id: "f0", number: { count: 1 } } as FieldMetadataWrapper;
      const field1Metadata = { id: "f1", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getSampleValues(sample, record, 0, field0Metadata, field1Metadata)).toStrictEqual([2, 3]);
    });

    test("undefined fields", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          s: [{ f0: 0 }, { f0: 2 }],
        },
      };
      const field0Metadata = { id: "f0", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getSampleValues(sample, record, 0, field0Metadata, undefined)).toStrictEqual([2, undefined]);
    });
  });

  describe("isNumerical", () => {
    test("FLOAT is numerical", () => {
      expect(isNumerical({ type: "FLOAT" } as FieldMetadata)).toBe(true);
    });

    test("INTEGER is numerical", () => {
      expect(isNumerical({ type: "INTEGER" } as FieldMetadata)).toBe(true);
    });

    test("STRING is not numerical", () => {
      expect(isNumerical({ type: "STRING" } as FieldMetadata)).toBe(false);
    });

    test("abbreviate header long text", () => {
      expect(abbreviateHeader("abcdefghijklmnopqrstuvwxyz")).toBe("abcdefghijk\u2026");
    });

    test("abbreviate header short text", () => {
      expect(abbreviateHeader("abcdef")).toBe("abcdef");
    });
  });

  describe("getInfoValueCount", () => {
    test("getInfoValueCount count=1", () => {
      const fieldMetadata = { id: "f0", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getInfoValueCount(recordBase, fieldMetadata)).toStrictEqual(1);
    });

    test("getInfoValueCount count=*", () => {
      const record = { ...recordBase, data: { ...recordBase.data, n: { f: [0, 1, 2, 3] } } };
      const fieldMetadata = { id: "f", number: { type: "OTHER" } } as FieldMetadataWrapper;
      expect(getInfoValueCount(record, fieldMetadata)).toStrictEqual(4);
    });

    test("getInfoValueCount parent=1 count=*", () => {
      const fieldMetadata = {
        id: "f_child",
        number: { type: "OTHER" },
        index: 2,
        parent: { id: "f", number: { count: 1 } },
      } as FieldMetadataWrapper;
      expect(getInfoValueCount(recordBase, fieldMetadata)).toStrictEqual(1);
    });

    test("getInfoValueCount parent=* count=1", () => {
      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          n: {
            f: [[], [0, 1], [2, 3, 4]],
          },
        },
      };
      const fieldMetadata = {
        id: "f_child",
        number: { count: 1 },
        index: 2,
        parent: { id: "f", number: { type: "OTHER" } },
      } as FieldMetadataWrapper;
      expect(getInfoValueCount(record, fieldMetadata)).toStrictEqual(3);
    });
  });

  describe("getSampleValueCount", () => {
    test("getInfoValueCount count=1", () => {
      const fieldMetadata = { id: "f0", number: { count: 1 } } as FieldMetadataWrapper;
      expect(getInfoValueCount(recordBase, fieldMetadata)).toStrictEqual(1);
    });

    test("getSampleValueCount count=*", () => {
      const sample = { item: { data: { index: 1 } } } as SampleContainer;

      const record = {
        ...recordBase,
        data: {
          ...recordBase.data,
          s: [{ f: [0, 1] }, { f: [2, 3, 4] }],
        },
      };

      const fieldMetadata = { id: "f", number: { type: "OTHER" } } as FieldMetadataWrapper;
      expect(getSampleValueCount(sample, record, fieldMetadata)).toStrictEqual(3);
    });
  });

  describe("getInfoField(s)", () => {
    const fieldMetadata = { id: "f", number: { type: "OTHER" } } as FieldMetadataWrapper;
    const vcfMetadata = {
      fieldMap: { "INFO/f": fieldMetadata },
    } as Partial<VcfMetadataContainer> as VcfMetadataContainer;

    test("get field", () => {
      expect(getInfoField(vcfMetadata, "f")).toStrictEqual(fieldMetadata);
    });

    test("get field undefined", () => {
      const vcfMetadata = {
        fieldMap: {},
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
      expect(getInfoField(vcfMetadata, "f")).toStrictEqual(undefined);
    });

    test("get fields", () => {
      const fieldMetadata0 = { id: "f0", number: { type: "OTHER" } } as FieldMetadataWrapper;
      const fieldMetadata1 = { id: "f1", number: { type: "OTHER" } } as FieldMetadataWrapper;
      const vcfMetadata = {
        fieldMap: { "INFO/f0": fieldMetadata0, "INFO/f1": fieldMetadata1 },
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
      expect(getInfoFields(vcfMetadata, "f0", "f1")).toStrictEqual([fieldMetadata0, fieldMetadata1]);
    });

    test("get fields undefined", () => {
      const fieldMetadata0 = { id: "f0", number: { type: "OTHER" } } as FieldMetadataWrapper;
      const vcfMetadata = {
        fieldMap: { "INFO/f0": fieldMetadata0 },
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
      expect(getInfoFields(vcfMetadata, "f0", "f1")).toStrictEqual([fieldMetadata0, undefined]);
    });
  });

  describe("getHeaderValue", () => {
    const vcfMetadata = {
      lines: ["##my_key=my_value"],
    } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
    test("get exists", () => {
      expect(getHeaderValue(vcfMetadata, "my_key")).toStrictEqual("my_value");
    });

    test("get not exists", () => {
      const vcfMetadata = {
        lines: ["##my_key2=my_value"],
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
      expect(getHeaderValue(vcfMetadata, "my_key")).toStrictEqual(null);
    });
  });

  describe("parseContigIds", () => {
    test("get not exists", () => {
      const vcfMetadata = {
        lines: ["##contig=<ID=chr1,length=248956422>", "##contig=<length=242193529,ID=chr2>"],
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;

      expect(parseContigIds(vcfMetadata)).toStrictEqual(["chr1", "chr2"]);
    });

    test("invalid", () => {
      const vcfMetadata = {
        lines: ["##contig=<KEY=value>"],
      } as Partial<VcfMetadataContainer> as VcfMetadataContainer;

      expect(() => parseContigIds(vcfMetadata)).toThrow();
    });
  });

  test("createFieldMap", () => {
    const f0 = { id: "f0" } as FieldMetadata;
    const f1 = { id: "f1" } as FieldMetadata;
    const p = {
      id: "p",
      nested: { items: [{ id: "c0" } as FieldMetadata, { id: "c1" } as FieldMetadata] },
    } as FieldMetadata;

    const vcfMetadata = {
      info: { f0, f1 },
      format: {
        p,
      },
    } as Partial<VcfMetadataContainer> as VcfMetadataContainer;
    expect(createFieldMap(vcfMetadata)).toStrictEqual({
      "INFO/f0": { id: "f0", index: 0 },
      "INFO/f1": { id: "f1", index: 1 },
      "FORMAT/p": {
        id: "p",
        index: 0,
        nested: {
          items: [
            { id: "c0", index: 0 },
            { id: "c1", index: 1 },
          ],
        },
      },
      "FORMAT/p/c0": { id: "c0", index: 0 },
      "FORMAT/p/c1": { id: "c1", index: 1 },
    });
  });

  describe("getInfoFieldsRegex", () => {
    const fieldMetadata0 = { id: "f", number: { type: "OTHER" } } as FieldMetadataWrapper;
    const fieldMetadata1 = { id: "f_with_postfix", number: { type: "OTHER" } } as FieldMetadataWrapper;
    const fieldMetadata2 = { id: "f", number: { type: "OTHER" } } as FieldMetadataWrapper;
    const vcfMetadata = {
      fieldMap: { "INFO/f": fieldMetadata0, "INFO/fx": fieldMetadata1, "FORMAT/f": fieldMetadata2 },
    } as Partial<VcfMetadataContainer> as VcfMetadataContainer;

    test("get", () => {
      expect(getInfoFieldsRegex(vcfMetadata, /^f$/)).toStrictEqual([fieldMetadata0]);
    });
  });

  describe("getSampleFieldsRegex", () => {
    const fieldMetadata0 = { id: "f", number: { type: "OTHER" } } as FieldMetadataWrapper;
    const fieldMetadata1 = { id: "fx", number: { type: "OTHER" } } as FieldMetadataWrapper;
    const fieldMetadata2 = { id: "fx", number: { type: "OTHER" } } as FieldMetadataWrapper;
    const vcfMetadata = {
      fieldMap: { "FORMAT/f": fieldMetadata0, "FORMAT/fx": fieldMetadata1, "INFO/f": fieldMetadata2 },
    } as Partial<VcfMetadataContainer> as VcfMetadataContainer;

    test("get", () => {
      expect(getSampleFieldsRegex(vcfMetadata, /^f$/)).toStrictEqual([fieldMetadata0]);
    });
  });
});
