import { describe, expect, test } from "vitest";
import { createRecordSort, createSortOrder, DIRECTION_ASCENDING, DIRECTION_DESCENDING } from "../utils/sortUtils";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";

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
  nObject0Meta.nested!.items.push(nString1Meta, nString2Meta);

  const metadata: Metadata = {
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
      })
    ).toStrictEqual({ orders: [{ field: nString0Meta, direction: DIRECTION_ASCENDING }] });
  });

  test("create record sort order from params sort order with nested path", () => {
    expect(
      createRecordSort(metadata, {
        property: ["n", "n_object0", 1],
        compare: "asc",
      })
    ).toStrictEqual({ orders: [{ field: nString2Meta, direction: DIRECTION_ASCENDING }] });
  });

  test("create record sort order from params sort order with invalid path with unknown item", () => {
    expect(() =>
      createRecordSort(metadata, {
        property: ["n", "n_unknown"],
        compare: "asc",
      })
    ).toThrowError();
  });

  test("create params sort order from record sort order with field", () => {
    const field: FieldMetadata = {
      id: "n_string1",
      number: {
        type: "NUMBER",
        count: 1,
      },
      type: "STRING",
    };

    expect(createSortOrder({ field, direction: DIRECTION_ASCENDING })).toStrictEqual({
      property: ["n", "n_string1"],
      compare: "asc",
    });
  });

  test("create params sort order from record sort order with nested field", () => {
    expect(createSortOrder({ field: nString2Meta, direction: DIRECTION_DESCENDING })).toStrictEqual({
      property: ["n", "n_object0", 1],
      compare: "desc",
    });
  });

  test("create params sort order from record sort order with invalid nested field", () => {
    const nString1Meta: FieldMetadata = {
      id: "n_string1",
      number: {
        type: "NUMBER",
        count: 1,
      },
      type: "STRING",
      parent: {
        id: "n_object0",
        number: {
          type: "OTHER",
        },
        type: "STRING",
        nested: {
          items: [], // corrupt because n_string1 is missing
          separator: ",",
        },
      },
    };

    expect(() => createSortOrder({ field: nString1Meta, direction: DIRECTION_DESCENDING })).toThrowError();
  });
});
