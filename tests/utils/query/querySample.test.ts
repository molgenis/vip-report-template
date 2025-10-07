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
      const classes = "U1,U2";
      const config = { filter_field, params: { vcf: { filter_samples: { classes } } } } as ConfigVip;
      const sample = { item: { id: 7, data: {} } } as SampleContainer;

      const selector = ["x"];
      const completeQuery: Query = {
        args: [
          {
            args: ["7",],
            operator: "in",
            selector: ["s", "sample_id",],
          },
          {
            args: "y",
            operator: "==",
            selector: ["x",],
          },
          {
            args: "HOM_REF",
            operator: "!=",
            selector: ["s", "GT_type",],
          },
        ],
        operator: "and",
      };
      const query: Query = {
            args: "y",
            operator: "==",
            selector: ["x",],
      };
      vi.mocked(createSelectorSample).mockReturnValue(selector);
      vi.mocked(createQueryFilterFieldCategorical).mockReturnValue(query);

      expect(createQuerySample(config, sample)).toStrictEqual(completeQuery);
      expect(createSelectorSample).toHaveBeenCalledWith(sample, filter_field);
      expect(createQueryFilterFieldCategorical).toHaveBeenCalledWith(selector, filter_field, [
        "U1",
        "U2",
        "__null",
      ]);
    });

    test("create without filter field", () => {
      const classes = "VUS,LP,P";
      const config = { filter_field: null, params: { vcf: { filter_samples: { classes } } } } as ConfigVip;
      const sample = { item: { data: { id: 1 } } } as SampleContainer;
      expect(createQuerySample(config, sample)).toStrictEqual(null);
    });
  });
});
