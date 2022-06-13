import { describe, expect, test } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { FilterQueries } from "../store";
import { createQuery } from "../utils/query";
import { QueryClause } from "@molgenis/vip-report-api/src/Api";

describe("query utilities", () => {
  const fieldMeta1: FieldMetadata = {
    id: "field1",
    number: { type: "NUMBER" },
    type: "CATEGORICAL",
  };
  const fieldMeta2: FieldMetadata = {
    id: "field2",
    number: { type: "NUMBER" },
    type: "CATEGORICAL",
  };

  const fieldMetaCsq: FieldMetadata = {
    id: "CSQ",
    number: { type: "NUMBER" },
    type: "STRING",
    nested: { items: [fieldMeta1, fieldMeta2], separator: "|" },
  };

  const meta: Metadata = { info: { CSQ: fieldMetaCsq } } as unknown as Metadata;

  test("create query", () => {
    const searchText = "my search text";
    const filterQueries: FilterQueries = {
      "CSQ/field1": { selector: ["n", "CSQ", "*", 0], operator: "==", args: [0] },
      "CSQ/field2": { selector: ["n", "CSQ", "*", 1], operator: "==", args: [1, 2] },
    };
    expect(createQuery(searchText, filterQueries, meta)).toStrictEqual({
      operator: "and",
      args: [
        {
          operator: "or",
          args: [
            { selector: ["n", "CSQ", "*", "0"], operator: "any_~=_any", args: ["my search text"] },
            { selector: ["n", "CSQ", "*", "1"], operator: "any_~=_any", args: ["my search text"] },
          ],
        },
        {
          operator: "and",
          args: [
            { selector: ["n", "CSQ", "*", 0], operator: "==", args: [0] },
            { selector: ["n", "CSQ", "*", 1], operator: "==", args: [1, 2] },
          ],
        },
      ],
    });
  });

  test("create query: undefined search and undefined filters", () => {
    expect(createQuery(undefined, undefined, meta)).toBe(null);
  });

  test("create query: undefined search and empty filters", () => {
    expect(createQuery(undefined, {}, meta)).toBe(null);
  });

  test("create query: undefined search and empty filters with keys", () => {
    expect(createQuery(undefined, { filterId: undefined }, meta)).toBe(null);
  });

  test("create query - search query only", () => {
    const searchText = "searchString";
    expect(createQuery(searchText, undefined, meta)).toStrictEqual({
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

  test("create query - filter queries only", () => {
    const filterQueries = {};
    expect(createQuery(undefined, filterQueries, meta)).toBe(null);
  });

  test("create query - one filter query", () => {
    const queryClause: QueryClause = { selector: ["n", "CSQ", "*", 0], operator: "==", args: [0] };
    const filterQueries: FilterQueries = {
      "CSQ/field1": queryClause,
    };
    expect(createQuery(undefined, filterQueries, meta)).toBe(queryClause);
  });
});
