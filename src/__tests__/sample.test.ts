import { describe, expect, test } from "vitest";
import { getSampleAffectedStatusLabel, getSampleLabel, getSampleSexLabel } from "../utils/sample";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";

describe("sample utilities", () => {
  test("getSampleLabel", () => {
    const individualId = "sample_label";
    const sample: Item<Sample> = {
      data: {
        person: {
          individualId: individualId,
        },
      },
    } as Item<Sample>;
    expect(getSampleLabel(sample)).toBe(individualId);
  });

  test("getSampleSexLabel:FEMALE", () => {
    const sample: Item<Sample> = {
      data: {
        person: {
          sex: "FEMALE",
        },
      },
    } as Item<Sample>;
    expect(getSampleSexLabel(sample)).toBe("female");
  });

  test("getSampleSexLabel:MALE", () => {
    const sample: Item<Sample> = {
      data: {
        person: {
          sex: "MALE",
        },
      },
    } as Item<Sample>;
    expect(getSampleSexLabel(sample)).toBe("male");
  });

  test("getSampleSexLabel:OTHER_SEX", () => {
    const sample: Item<Sample> = {
      data: {
        person: {
          sex: "OTHER_SEX",
        },
      },
    } as Item<Sample>;
    expect(getSampleSexLabel(sample)).toBe("?");
  });

  test("getSampleSexLabel:UNKNOWN_SEX", () => {
    const sample: Item<Sample> = {
      data: {
        person: {
          sex: "UNKNOWN_SEX",
        },
      },
    } as Item<Sample>;
    expect(getSampleSexLabel(sample)).toBe("?");
  });

  test("getSampleAffectedStatusLabel:AFFECTED", () => {
    const sample: Item<Sample> = {
      data: {
        person: {
          affectedStatus: "AFFECTED",
        },
      },
    } as Item<Sample>;
    expect(getSampleAffectedStatusLabel(sample)).toBe("affected");
  });

  test("getSampleAffectedStatusLabel:UNAFFECTED", () => {
    const sample: Item<Sample> = {
      data: {
        person: {
          affectedStatus: "UNAFFECTED",
        },
      },
    } as Item<Sample>;
    expect(getSampleAffectedStatusLabel(sample)).toBe("unaffected");
  });

  test("getSampleAffectedStatusLabel:MISSING", () => {
    const sample: Item<Sample> = {
      data: {
        person: {
          affectedStatus: "MISSING",
        },
      },
    } as Item<Sample>;
    expect(getSampleAffectedStatusLabel(sample)).toBe("?");
  });
});
