import { expect, test } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { getConsequenceLabel, getRecordSamples, getSpecificConsequence } from "../utils/viewUtils";
import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Sample } from "@molgenis/vip-report-api/src/Api";

const fieldMetaCsq: FieldMetadata = {
  description: "Consequence",
  id: "Consequence",
  number: { type: "PER_ALT" },
  type: "STRING",
};
const fieldMeta1: FieldMetadata = { description: "fake 1", id: "field1", number: { type: "NUMBER" }, type: "STRING" };
const fieldMeta2: FieldMetadata = { description: "fake 2", id: "field2", number: { type: "NUMBER" }, type: "STRING" };

const value1a: Value = "testValue1a";
const value2a: Value = "testValue2a";
const value3a: Value = "testValue3a";
const value1b: Value = "testValue1b";
const value2b: Value = "testValue2b";
const value3b: Value = "testValue3b";
const valueArraya: ValueArray = [value1a, value2a, value3a];
const valueArrayb: ValueArray = [value1b, value2b, value3b];

test("Get specific consequence", () => {
  expect(getSpecificConsequence([valueArraya, valueArrayb], 1)).toBe(valueArrayb);
});

test("Get specific consequence - out of bounds", () => {
  expect(getSpecificConsequence([valueArraya, valueArrayb], 9)).toStrictEqual([] as ValueArray);
});

test("Get specific consequence - -1", () => {
  expect(() => getSpecificConsequence([valueArraya, valueArrayb], -1)).toThrowError(
    "Consequences index must be 0 or higher."
  );
});

test("Get Consequence Label", () => {
  expect(getConsequenceLabel([valueArraya, valueArrayb], 1, [fieldMeta1, fieldMetaCsq, fieldMeta2])).toBe(
    "testValue2b"
  );
});

test("Get Record samples", () => {
  const patient: Sample = {
    index: 0,
    person: {
      familyId: "FAM001",
      individualId: "Patient",
      sex: "FEMALE",
      affectedStatus: "AFFECTED",
      maternalId: "Mother",
      paternalId: "Father",
    },
    proband: true,
  };
  const father: Sample = {
    index: 1,
    person: {
      familyId: "FAM001",
      individualId: "Father",
      sex: "MALE",
      affectedStatus: "UNAFFECTED",
      maternalId: "",
      paternalId: "",
    },
    proband: false,
  };
  const mother: Sample = {
    index: 2,
    person: {
      familyId: "FAM001",
      individualId: "Mother",
      sex: "FEMALE",
      affectedStatus: "UNAFFECTED",
      maternalId: "",
      paternalId: "",
    },
    proband: false,
  };
  const samples = [patient, mother, father];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const record: Record = { a: [], c: "", f: [], i: [], n: undefined, p: 0, q: undefined, r: "", s: samples };

  const result = getRecordSamples(record, patient, samples);
  expect(result).toContainEqual({
    index: 0,
    person: {
      affectedStatus: "AFFECTED",
      familyId: "FAM001",
      individualId: "Patient",
      maternalId: "Mother",
      paternalId: "Father",
      sex: "FEMALE",
    },
    proband: true,
  });
  expect(result).toContainEqual({
    index: 2,
    person: {
      affectedStatus: "UNAFFECTED",
      familyId: "FAM001",
      individualId: "Mother",
      maternalId: "",
      paternalId: "",
      sex: "FEMALE",
    },
    proband: false,
  });
  expect(result).toContainEqual({
    index: 1,
    person: {
      affectedStatus: "UNAFFECTED",
      familyId: "FAM001",
      individualId: "Father",
      maternalId: "",
      paternalId: "",
      sex: "MALE",
    },
    proband: false,
  });
});
