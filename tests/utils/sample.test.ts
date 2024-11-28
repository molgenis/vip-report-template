import { describe, expect, test } from "vitest";
import {
  getPedigreeSamples,
  getSampleAffectedStatusLabel,
  getSampleLabel,
  getSampleSexLabel,
  isSampleFather,
  isSampleMother,
} from "../../src/utils/sample.ts";
import { Item, Sample } from "@molgenis/vip-report-api";
import { SampleContainer } from "../../src/utils/api.ts";

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
    expect(getSampleLabel(sample)).toStrictEqual(individualId);
  });

  describe("getSampleSexLabel", () => {
    test("FEMALE", () => {
      const sample: Item<Sample> = {
        data: {
          person: {
            sex: "FEMALE",
          },
        },
      } as Item<Sample>;
      expect(getSampleSexLabel(sample)).toStrictEqual("female");
    });

    test("MALE", () => {
      const sample: Item<Sample> = {
        data: {
          person: {
            sex: "MALE",
          },
        },
      } as Item<Sample>;
      expect(getSampleSexLabel(sample)).toStrictEqual("male");
    });

    test("OTHER_SEX", () => {
      const sample: Item<Sample> = {
        data: {
          person: {
            sex: "OTHER_SEX",
          },
        },
      } as Item<Sample>;
      expect(getSampleSexLabel(sample)).toStrictEqual("?");
    });

    test("UNKNOWN_SEX", () => {
      const sample: Item<Sample> = {
        data: {
          person: {
            sex: "UNKNOWN_SEX",
          },
        },
      } as Item<Sample>;
      expect(getSampleSexLabel(sample)).toStrictEqual("?");
    });
  });

  describe("getSampleAffectedStatusLabel", () => {
    test("AFFECTED", () => {
      const sample: Item<Sample> = {
        data: {
          person: {
            affectedStatus: "AFFECTED",
          },
        },
      } as Item<Sample>;
      expect(getSampleAffectedStatusLabel(sample)).toStrictEqual("affected");
    });

    test("UNAFFECTED", () => {
      const sample: Item<Sample> = {
        data: {
          person: {
            affectedStatus: "UNAFFECTED",
          },
        },
      } as Item<Sample>;
      expect(getSampleAffectedStatusLabel(sample)).toStrictEqual("unaffected");
    });

    test("MISSING", () => {
      const sample: Item<Sample> = {
        data: {
          person: {
            affectedStatus: "MISSING",
          },
        },
      } as Item<Sample>;
      expect(getSampleAffectedStatusLabel(sample)).toStrictEqual("?");
    });
  });

  describe("isSampleMother", () => {
    test("true", () => {
      const sample: Sample = {
        person: {
          maternalId: "mother0",
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "mother0",
          familyId: "fam0",
        },
      } as Sample;
      expect(isSampleMother(sample, sampleMaternal)).toStrictEqual(true);
    });

    test("false, mother unknown", () => {
      const sample: Sample = {
        person: {
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "mother0",
          familyId: "fam0",
        },
      } as Sample;
      expect(isSampleMother(sample, sampleMaternal)).toStrictEqual(false);
    });

    test("false, different family", () => {
      const sample: Sample = {
        person: {
          maternalId: "mother0",
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "mother0",
          familyId: "fam1",
        },
      } as Sample;
      expect(isSampleMother(sample, sampleMaternal)).toStrictEqual(false);
    });

    test("false, different individual id", () => {
      const sample: Sample = {
        person: {
          maternalId: "mother0",
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "individual0",
          familyId: "fam1",
        },
      } as Sample;
      expect(isSampleMother(sample, sampleMaternal)).toStrictEqual(false);
    });
  });

  describe("isSampleFather", () => {
    test("true", () => {
      const sample: Sample = {
        person: {
          paternalId: "father0",
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "father0",
          familyId: "fam0",
        },
      } as Sample;
      expect(isSampleFather(sample, sampleMaternal)).toStrictEqual(true);
    });

    test("false, mother unknown", () => {
      const sample: Sample = {
        person: {
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "father0",
          familyId: "fam0",
        },
      } as Sample;
      expect(isSampleFather(sample, sampleMaternal)).toStrictEqual(false);
    });

    test("false, different family", () => {
      const sample: Sample = {
        person: {
          paternalId: "father0",
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "father0",
          familyId: "fam1",
        },
      } as Sample;
      expect(isSampleFather(sample, sampleMaternal)).toStrictEqual(false);
    });

    test("false, different individual id", () => {
      const sample: Sample = {
        person: {
          paternalId: "father0",
          familyId: "fam0",
        },
      } as Sample;
      const sampleMaternal: Sample = {
        person: {
          individualId: "individual0",
          familyId: "fam1",
        },
      } as Sample;
      expect(isSampleFather(sample, sampleMaternal)).toStrictEqual(false);
    });
  });
  describe("getPedigreeSamples", () => {
    test("get", () => {
      const sample = {
        item: { id: 0 },
        maternalSample: { id: 1 },
        paternalSample: { id: 2 },
        otherPedigreeSamples: [{ id: 3 }, { id: 4 }],
      } as SampleContainer;

      expect(getPedigreeSamples(sample)).toStrictEqual([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });

    test("get, no father/mother/other", () => {
      const sample = {
        item: { id: 0 },
        maternalSample: null,
        paternalSample: null,
        otherPedigreeSamples: [] as Item<Sample>[],
      } as SampleContainer;

      expect(getPedigreeSamples(sample)).toStrictEqual([{ id: 0 }]);
    });
  });
});
