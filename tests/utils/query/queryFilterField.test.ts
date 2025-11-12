import { afterEach, describe, expect, test, vi } from "vitest";
import { Query } from "@molgenis/vip-report-api";
import { createQueryFilterClosedInterval, createQueryFilterString } from "../../../src/utils/query/queryFilter.ts";
import { createQueryFilterField } from "../../../src/utils/query/queryFilterField.ts";
import { ConfigFilterField, ConfigFilterFormat } from "../../../src/types/configFilter";
import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { SampleContainer } from "../../../src/utils/api.ts";

describe("query filter fixed", () => {
  vi.mock(import("../../../src/utils/query/queryFilter.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createQueryFilterFixed", () => {
    const query: Query = { selector: "x", operator: "==", args: "y" };

    test("CATEGORICAL count=1 info", () => {
      const categories = { cat: { label: "my_label" } };
      const field = { id: "f", type: "CATEGORICAL", number: { type: "NUMBER", count: 1 }, categories } as FieldMetadata;
      const config = { type: "info", id: "filter", field } as ConfigFilterField;
      const value = ["x"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterField(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["n", "f"], value, false);
    });

    test("CHARACTER count=1 info", () => {
      const field = { id: "f", type: "CHARACTER", number: { type: "NUMBER", count: 1 } } as FieldMetadata;
      const config = { type: "info", id: "filter", field } as ConfigFilterField;
      const value = ["x"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterField(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["n", "f"], value, false);
    });

    test("STRING count=* info nested", () => {
      const field = { id: "c", parent: { id: "p" }, type: "STRING", number: { type: "OTHER" } } as FieldMetadata;
      const config = { type: "info", id: "filter", field } as ConfigFilterField;
      const value = ["x"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterField(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["n", "p", "c"], value, true);
    });

    test("STRING count=* genotype", () => {
      const field = { id: "f", type: "STRING", number: { type: "OTHER" } } as FieldMetadata;
      const sample = { item: { id: 1, data: { index: 1 } } } as SampleContainer;
      const config = { type: "genotype", id: "filter", field, sample } as ConfigFilterFormat;
      const value = ["x"];
      vi.mocked(createQueryFilterString).mockReturnValue(query);
      expect(createQueryFilterField(config, value)).toStrictEqual(query);
      expect(createQueryFilterString).toHaveBeenCalledWith(["s", 1, "f"], value, true);
    });

    test("FLOAT count=1 info", () => {
      const field = { id: "f", type: "FLOAT", number: { type: "NUMBER", count: 1 } } as FieldMetadata;
      const config = { type: "info", id: "filter", field } as ConfigFilterField;
      const value = { left: 1.23, right: 3.45 };
      vi.mocked(createQueryFilterClosedInterval).mockReturnValue(query);
      expect(createQueryFilterField(config, value)).toStrictEqual(query);
      expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["n", "f"], value);
    });

    test("INTEGER count=1 info", () => {
      const field = { id: "f", type: "INTEGER", number: { type: "NUMBER", count: 1 } } as FieldMetadata;
      const config = { type: "info", id: "filter", field } as ConfigFilterField;
      const value = { left: 1, right: 3 };
      vi.mocked(createQueryFilterClosedInterval).mockReturnValue(query);
      expect(createQueryFilterField(config, value)).toStrictEqual(query);
      expect(createQueryFilterClosedInterval).toHaveBeenCalledWith(["n", "f"], value);
    });
  });
});
