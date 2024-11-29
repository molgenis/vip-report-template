import { afterEach, describe, expect, test, vi } from "vitest";
import { createQuerySample } from "../../../src/utils/query/querySample.ts";
import { ConfigVip } from "../../../src/types/config";
import { SampleContainer } from "../../../src/utils/api.ts";
import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { createQueryFilterFieldCategorical } from "../../../src/utils/query/queryFilterField.ts";
import { createSelectorSample } from "../../../src/utils/query/selector.ts";
import { Query } from "@molgenis/vip-report-api";

describe("query sample", () => {
  vi.mock(import("../../../src/utils/query/selector.ts"));
  vi.mock(import("../../../src/utils/query/queryFilterField.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createQuerySample", () => {
    test("create", () => {
      const filter_field = {
        id: "FORMAT/VIPC_S",
        type: "CATEGORICAL",
        number: { type: "NUMBER", count: 1 },
        categories: {},
      } as FieldMetadata;
      const classes = "VUS,LP,P";
      const config = { filter_field, params: { vcf: { filter_samples: { classes } } } } as ConfigVip;
      const sample = { item: { data: { index: 1 } } } as SampleContainer;

      const selector = ["x"];
      const query: Query = { selector, operator: "==", args: "y" };
      vi.mocked(createSelectorSample).mockReturnValue(selector);
      vi.mocked(createQueryFilterFieldCategorical).mockReturnValue(query);

      expect(createQuerySample(config, sample)).toStrictEqual(query);
      expect(createSelectorSample).toHaveBeenCalledWith(sample, filter_field);
      expect(createQueryFilterFieldCategorical).toHaveBeenCalledWith(selector, filter_field, [
        "VUS",
        "LP",
        "P",
        "__null",
      ]);
    });

    test("create without filter field", () => {
      const classes = "VUS,LP,P";
      const config = { filter_field: null, params: { vcf: { filter_samples: { classes } } } } as ConfigVip;
      const sample = { item: { data: { index: 1 } } } as SampleContainer;
      expect(createQuerySample(config, sample)).toStrictEqual(null);
    });
  });
});
