import { expect, test } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { createFilterQuery, createQuery, createSearchQuery } from "../utils/query";
import { FilterQueries } from "../components/filter/Filters";
import { InfoFilterQueries } from "../components/filter/InfoFilters";
import { SampleFilterQueries, SampleFilterQuery } from "../components/filter/SampleFilters";
import { SamplesFilterQueries } from "../components/filter/SamplesFilters";

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
  const infoQueries: InfoFilterQueries = {};
  infoQueries["meta1"] = { field: fieldMeta1, operator: "any_has_any", value: ["1", "2"] };
  infoQueries["meta2"] = { field: fieldMeta2, operator: "any_has_any", value: ["1"] };

  const samplesQueries: SamplesFilterQueries = {};
  const sampleFilterQueries: SampleFilterQueries = {};
  const sampleFilterQuery: SampleFilterQuery = {
    sample: {
      person: {
        familyId: "0",
        individualId: "x",
        paternalId: "y",
        maternalId: "z",
        sex: "UNKNOWN_SEX",
        affectedStatus: "MISSING",
      },
      index: 1,
      proband: true,
    },
    query: { field: fieldMeta1, operator: "==", value: "" },
  };
  sampleFilterQueries["sampleFilter1"] = sampleFilterQuery;
  samplesQueries[1] = sampleFilterQueries;
  const filterQueries: FilterQueries = { infoQueries: infoQueries, samplesQueries: samplesQueries };

  const output = createFilterQuery(filterQueries);
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
      {
        selector: ["s", 1, "field1"],
        operator: "==",
        args: "",
      },
    ],
  });
});

test("Create combined query", () => {
  const infoQueries: InfoFilterQueries = {};
  infoQueries["meta1"] = { field: fieldMeta1, operator: "any_has_any", value: ["1", "2"] };
  infoQueries["meta2"] = { field: fieldMeta2, operator: "any_has_any", value: ["1"] };

  const samplesQueries: SamplesFilterQueries = {};
  const sampleFilterQueries: SampleFilterQueries = {};
  const sampleFilterQuery: SampleFilterQuery = {
    sample: {
      person: {
        familyId: "0",
        individualId: "x",
        paternalId: "y",
        maternalId: "z",
        sex: "UNKNOWN_SEX",
        affectedStatus: "MISSING",
      },
      index: 1,
      proband: true,
    },
    query: { field: fieldMeta1, operator: "==", value: "" },
  };
  sampleFilterQueries["sampleFilter1"] = sampleFilterQuery;
  samplesQueries[1] = sampleFilterQueries;
  const filterQueries: FilterQueries = { infoQueries: infoQueries, samplesQueries: samplesQueries };

  const output = createQuery("searchString", filterQueries, {
    info: { CSQ: fieldMetaCsq },
    lines: [],
    format: {},
    samples: [],
  });
  expect(output).toEqual({
    operator: "and",
    args: [
      {
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
      },
      {
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
          {
            selector: ["s", 1, "field1"],
            operator: "==",
            args: "",
          },
        ],
      },
    ],
  });
});
