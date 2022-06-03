import { describe, expect, test } from "vitest";
import { parseSearchParams } from "../utils/searchParamsUtils";

describe("search params utilities", () => {
  test("parse page param", () => {
    expect(parseSearchParams({ page: "2" })).toStrictEqual({ page: 2 });
  });

  test("parse page param: not a number", () => {
    expect(() => parseSearchParams({ page: "a" })).toThrowError();
  });

  test("parse page param: negative number", () => {
    expect(() => parseSearchParams({ page: "-1" })).toThrowError();
  });

  test("parse page param: not an integer", () => {
    expect(() => parseSearchParams({ page: "3.14" })).toThrowError();
  });

  test("parse size param", () => {
    expect(parseSearchParams({ size: "20" })).toStrictEqual({ size: 20 });
  });

  test("parse size param: not a number", () => {
    expect(() => parseSearchParams({ size: "a" })).toThrowError();
  });

  test("parse size param: negative number", () => {
    expect(() => parseSearchParams({ size: "-1" })).toThrowError();
  });

  test("parse size param: not an integer", () => {
    expect(() => parseSearchParams({ size: "3.14" })).toThrowError();
  });

  test("parse query param", () => {
    const query = '{"selector":["n","CSQ","*","0"],"operator":"~=_any","args":["x"]}';
    expect(parseSearchParams({ query })).toStrictEqual({
      query: {
        args: ["x"],
        operator: "~=_any",
        selector: ["n", "CSQ", "*", 0],
      },
    });
  });

  test("parse query param: invalid JSON", () => {
    const query = "invalid";
    expect(() => parseSearchParams({ query })).toThrowError();
  });

  test("parse sort param", () => {
    const sort = '{"property":["n","CSQ",51],"compare":"desc"}';
    expect(parseSearchParams({ sort })).toStrictEqual({
      sort: {
        property: ["n", "CSQ", "*", 51],
        compare: "desc",
      },
    });
  });

  test("parse sort param: invalid JSON", () => {
    const sort = "invalid";
    expect(() => parseSearchParams({ sort })).toThrowError();
  });
});
