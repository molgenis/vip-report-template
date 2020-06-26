import { append, formatNumber } from "@/globals/filters";

test("format number between -10000 and -1000", () => {
  expect(formatNumber(-1234, true)).toEqual("-1,234");
});

test("format number between -1000 and 0", () => {
  expect(formatNumber(-999)).toEqual("-999");
});

test("format number between 0 and 1000", () => {
  expect(formatNumber(999)).toEqual("999");
});

test("format number between 1000 and 10000", () => {
  expect(formatNumber(1234, true)).toEqual("1,234");
});

test("format number between 1000000 and 10000000", () => {
  expect(formatNumber(1234567, true)).toEqual("1,234,567");
});

test("append the first string to the last string", () => {
  expect(append("last", "first")).toEqual("firstlast");
});
