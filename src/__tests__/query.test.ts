import { describe, expect, test } from "vitest";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { infoSortPath } from "../utils/query";

describe("query utilities", () => {
  const fieldMetaCsq: FieldMetadata = {
    id: "CSQ",
    number: { type: "NUMBER" },
    type: "STRING",
  };

  test("infoSortPath", () => {
    expect(infoSortPath(fieldMetaCsq)).toStrictEqual(["n", "CSQ"]);
  });
});
