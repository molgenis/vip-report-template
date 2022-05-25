import { expect, test } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { createFilterQuery, createFormatFilterQuery, createSearchQuery } from "../utils/query";
import { FilterChangeEvent } from "../components/filter/Filters";
import { FormatFilterChangeEvent } from "../components/filter/FormatFilters";

const fieldMeta1: FieldMetadata = {
  description: "fake 1",
  id: "field1",
  number: { type: "NUMBER" },
  type: "CATEGORICAL",
};
const fieldMeta2: FieldMetadata = {
  description: "fake 2",
  id: "field2",
  number: { type: "NUMBER" },
  type: "CATEGORICAL",
};

const fieldMetaCsq: FieldMetadata = {
  description: "VEP",
  id: "CSQ",
  number: { type: "NUMBER" },
  type: "STRING",
  nested: { items: [fieldMeta1, fieldMeta2], separator: "|" },
};

test("Create search query", () => {
  expect(
    createSearchQuery("searchString", { info: { CSQ: fieldMetaCsq }, lines: [], format: {}, samples: [] })
  ).toEqual({
    args: [
      {
        args: ["searchString"],
        operator: "any_~=_any",
        selector: ["n", "CSQ", "*", "0"],
      },
      {
        args: ["searchString"],
        operator: "any_~=_any",
        selector: ["n", "CSQ", "*", "1"],
      },
    ],
    operator: "or",
  });
});

test("Create filter query", () => {
  const filterevent: FilterChangeEvent[] = [
    { field: fieldMeta1, value: ["1", "2"] },
    { field: fieldMeta2, value: ["1"] },
  ];
  const output = createFilterQuery(filterevent);
  expect(output).toEqual({
    operator: "and",
    args: [
      {
        selector: ["n", "field1"],
        operator: "any_has_any",
        args: ["1", "2"],
      },
      {
        selector: ["n", "field2"],
        operator: "any_has_any",
        args: ["1"],
      },
    ],
  });
});

test("Create format filter query", () => {
  const filterevent: FormatFilterChangeEvent[] = [{ fieldMetadata: fieldMeta1, operator: "==", value: undefined }];
  const output = createFormatFilterQuery(filterevent, 1);
  expect(output).toEqual({
    selector: ["s", 1, "field1"],
    operator: "==",
    args: "",
  });
});
