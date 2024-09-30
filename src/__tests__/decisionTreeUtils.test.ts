import { expect, test } from "vitest";
import { getDecisionTreePath } from "../utils/decisionTreeUtils";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";

test("Get DecisionTree Path", () => {
  const fieldMetaVIPP: FieldMetadata = {
    description: "VIP Decision tree path",
    id: "VIPP",
    number: { type: "NUMBER" },
    type: "STRING",
  };
  const fieldMetaOther: FieldMetadata = {
    description: "Other",
    id: "Other",
    number: { type: "NUMBER" },
    type: "STRING",
  };

  const fieldMetaCsq: FieldMetadata = {
    description: "VEP",
    id: "CSQ",
    number: { type: "NUMBER" },
    type: "STRING",
    nested: { items: [fieldMetaOther, fieldMetaVIPP], separator: "|" },
  };

  const variant: Item<Record> = {
    data: {
      a: [],
      c: "",
      f: [],
      i: [],
      n: {
        CSQ: [["T", "gnomad&mvl&clinvar&exit", "MODERATE"]],
      },
    },
  } as unknown as Item<Record>;
  expect(getDecisionTreePath({ info: { CSQ: fieldMetaCsq }, lines: [], format: {}, samples: [] }, variant, 0)).toBe(
    "gnomad&mvl&clinvar&exit",
  );
});

test("Get DecisionTree Path - no VIPP", () => {
  const fieldMetaOther: FieldMetadata = {
    description: "Other",
    id: "Other",
    number: { type: "NUMBER" },
    type: "STRING",
  };

  const fieldMetaCsq: FieldMetadata = {
    description: "VEP",
    id: "CSQ",
    number: { type: "NUMBER" },
    type: "STRING",
    nested: { items: [fieldMetaOther], separator: "|" },
  };

  const variant: Item<Record> = {
    data: {
      a: [],
      c: "",
      f: [],
      i: [],
      n: {
        CSQ: [["T", "gnomad&mvl&clinvar&exit", "MODERATE"]],
      },
    },
  } as unknown as Item<Record>;
  expect(getDecisionTreePath({ info: { CSQ: fieldMetaCsq }, lines: [], format: {}, samples: [] }, variant, 0)).toBe(
    undefined,
  );
});
