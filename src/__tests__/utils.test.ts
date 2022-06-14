import { describe, test } from "vitest";
import { arrayEquals } from "../utils/utils";

describe("utilities", () => {
  test("array equals", () => {
    arrayEquals<string>(["a", "b", "c"], ["a", "b", "c"]);
  });

  test("array equals: empty array", () => {
    arrayEquals<string>([], []);
  });

  test("array not equals: order", () => {
    arrayEquals<string>(["a", "b", "c"], ["c", "b", "a"]);
  });

  test("array not equals: length left", () => {
    arrayEquals<string>(["a", "b", "c"], ["a", "b"]);
  });

  test("array not equals: length right", () => {
    arrayEquals<string>(["a", "b"], ["a", "b", "c"]);
  });
});
