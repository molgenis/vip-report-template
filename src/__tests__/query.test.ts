import { describe, expect, test } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { FilterQueries } from "../store";
import {
  createQuery,
  createSampleQuery,
  infoFieldKey,
  infoSelector,
  infoSortPath,
  sampleFieldKey,
  sampleSelector,
  selectorKey,
} from "../utils/query";
import { Item, Person, Query, QueryClause, Sample } from "@molgenis/vip-report-api/src/Api";

describe("query utilities", () => {
  let fieldMetaCsq: FieldMetadata = {
    id: "CSQ",
    number: { type: "NUMBER" },
    type: "STRING",
  };

  const fieldMeta1: FieldMetadata = {
    id: "field1",
    number: { type: "NUMBER" },
    type: "CATEGORICAL",
    parent: fieldMetaCsq,
  };

  const fieldMeta2: FieldMetadata = {
    id: "field2",
    number: { type: "NUMBER" },
    type: "CATEGORICAL",
    parent: fieldMetaCsq,
  };

  fieldMetaCsq = {
    id: "CSQ",
    number: { type: "NUMBER" },
    type: "STRING",
    nested: { items: [fieldMeta1, fieldMeta2], separator: "|" },
  };

  const person: Person = {
    familyId: "FAM001",
    individualId: "Patient",
    sex: "FEMALE",
    affectedStatus: "AFFECTED",
    maternalId: "Mother",
    paternalId: "Father",
  };

  const meta: Metadata = { info: { CSQ: fieldMetaCsq } } as unknown as Metadata;

  test("create sample query - filters", () => {
    const sample = { data: { index: 1 } } as Item<Sample>;
    const queryClause: Query = {
      operator: "and",
      args: [
        { selector: ["s", 1, "GT", "t"], operator: "!=", args: "hom_r" },
        { selector: ["s", 1, "GT", "t"], operator: "!=", args: "miss" },
      ],
    };
    const filterQueryClause: QueryClause = { selector: ["n", "CSQ", "*", 0], operator: "==", args: [0] };
    const filterQueries: FilterQueries = {
      "CSQ/field1": filterQueryClause,
    };
    expect(createSampleQuery(sample, undefined, filterQueries, meta)).toStrictEqual({
      operator: "and",
      args: [queryClause, filterQueryClause],
    });
  });

  test("create sample query - undefined search and undefined filters", () => {
    const sample = { data: { index: 1 } } as Item<Sample>;
    const queryClause: Query = {
      operator: "and",
      args: [
        { selector: ["s", 1, "GT", "t"], operator: "!=", args: "hom_r" },
        { selector: ["s", 1, "GT", "t"], operator: "!=", args: "miss" },
      ],
    };
    expect(createSampleQuery(sample, undefined, undefined, meta)).toStrictEqual(queryClause);
  });

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

  test("infoSelector", () => {
    expect(infoSelector(fieldMeta1)).toStrictEqual(["n", "CSQ", "field1"]);
  });

  test("sampleSelector", () => {
    expect(sampleSelector({ id: 1, data: { person: person, index: 0, proband: false } }, fieldMeta1)).toStrictEqual([
      "s",
      0,
      "CSQ",
      "field1",
    ]);
  });

  test("selectorKey", () => {
    expect(selectorKey([1, "test", 2, "3"])).toStrictEqual("1/test/2/3");
  });

  test("infoFieldKey", () => {
    expect(infoFieldKey(fieldMeta1)).toStrictEqual("n/CSQ/field1");
  });

  test("sampleFieldKey", () => {
    expect(sampleFieldKey({ id: 1, data: { person: person, index: 0, proband: false } }, fieldMeta1)).toStrictEqual(
      "s/0/CSQ/field1",
    );
  });

  test("infoSortPath", () => {
    expect(infoSortPath(fieldMetaCsq)).toStrictEqual(["n", "CSQ"]);
  });
});
