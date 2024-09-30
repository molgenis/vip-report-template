import { expect, test } from "vitest";
import { getSpecificConsequence } from "../utils/viewUtils";
import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";

const value1a: Value = "testValue1a";
const value2a: Value = "testValue2a";
const value3a: Value = "testValue3a";
const value1b: Value = "testValue1b";
const value2b: Value = "testValue2b";
const value3b: Value = "testValue3b";
const valueArrayA: ValueArray = [value1a, value2a, value3a];
const valueArrayB: ValueArray = [value1b, value2b, value3b];

test("Get specific consequence", () => {
  expect(getSpecificConsequence([valueArrayA, valueArrayB], 1)).toBe(valueArrayB);
});

test("Get specific consequence - out of bounds", () => {
  expect(getSpecificConsequence([valueArrayA, valueArrayB], 9)).toStrictEqual([] as ValueArray);
});

test("Get specific consequence - -1", () => {
  expect(() => getSpecificConsequence([valueArrayA, valueArrayB], -1)).toThrowError(
    "Consequences index must be 0 or higher.",
  );
});
