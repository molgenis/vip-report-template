import { describe, expect, test } from "vitest";
import { createRecordSort, DIRECTION_ASCENDING } from "../../../src/utils/query/sort.ts";
import { FieldMetadata, VcfMetadata } from "@molgenis/vip-report-vcf";

describe("sort utilities", () => {
  const nString0Meta: FieldMetadata = {
    id: "n_string0",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "STRING",
  };

  const nString1Meta: FieldMetadata = {
    id: "n_string1",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "STRING",
  };

  const nString2Meta: FieldMetadata = {
    id: "n_string2",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "STRING",
  };

  const nObject0Meta: FieldMetadata = {
    id: "n_object0",
    number: {
      type: "OTHER",
    },
    type: "STRING",
    nested: {
      items: [],
      separator: ",",
    },
  };

  nString1Meta.parent = nObject0Meta;
  nString2Meta.parent = nObject0Meta;
  nObject0Meta.nested?.items.push(nString1Meta, nString2Meta);

  const metadata: VcfMetadata = {
    lines: [],
    info: { n_string0: nString0Meta, n_object0: nObject0Meta },
    format: {},
    samples: [],
  };

  test("create record sort order from params sort order", () => {
    expect(
      createRecordSort(metadata, {
        property: ["n", "n_string0"],
        compare: "asc",
      }),
    ).toStrictEqual({ orders: [{ field: nString0Meta, direction: DIRECTION_ASCENDING }] });
  });

  test("create record sort order from params sort order with nested path", () => {
    expect(
      createRecordSort(metadata, {
        property: ["n", "n_object0", 1],
        compare: "asc",
      }),
    ).toStrictEqual({ orders: [{ field: nString2Meta, direction: DIRECTION_ASCENDING }] });
  });

  test("create record sort order from params sort order with invalid path with unknown item", () => {
    expect(() =>
      createRecordSort(metadata, {
        property: ["n", "n_unknown"],
        compare: "asc",
      }),
    ).toThrowError();
  });
});
