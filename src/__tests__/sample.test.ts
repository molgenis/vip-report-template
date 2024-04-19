import { describe, expect, test } from "vitest";
import {
  getSampleAffectedStatusLabel,
  getSampleFamilyMembersWithoutParents,
  getSampleFather,
  getSampleLabel,
  getSampleMother,
  getSampleSexLabel,
} from "../utils/sample";
import { Sample } from "@molgenis/vip-report-api/src/Api";

describe("sample utilities", () => {
  const sample = {
    person: {
      familyId: "fam0",
      individualId: "0",
      maternalId: "1",
      paternalId: "2",
    },
  } as Sample;
  const motherSample = {
    person: {
      familyId: "fam0",
      individualId: "1",
    },
  } as Sample;
  const fatherSample = {
    person: {
      familyId: "fam0",
      individualId: "2",
    },
  } as Sample;
  const siblingSample = {
    person: {
      familyId: "fam0",
      individualId: "3",
      maternalId: "1",
      paternalId: "2",
    },
  } as Sample;
  const otherMotherSample = {
    person: {
      familyId: "fam1",
      individualId: "1",
    },
  } as Sample;
  const otherFatherSample = {
    person: {
      familyId: "fam1",
      individualId: "2",
    },
  } as Sample;
  const otherSiblingSample = {
    person: {
      familyId: "fam1",
      individualId: "3",
      maternalId: "1",
      paternalId: "2",
    },
  } as Sample;

  test("getSampleLabel", () => {
    const individualId = "sample_label";
    const sample = {
      person: {
        individualId: individualId,
      },
    } as Sample;
    expect(getSampleLabel(sample)).toBe(individualId);
  });

  test("getSampleSexLabel:FEMALE", () => {
    const sample = {
      person: {
        sex: "FEMALE",
      },
    } as Sample;
    expect(getSampleSexLabel(sample)).toBe("female");
  });

  test("getSampleSexLabel:MALE", () => {
    const sample = {
      person: {
        sex: "MALE",
      },
    } as Sample;
    expect(getSampleSexLabel(sample)).toBe("male");
  });

  test("getSampleSexLabel:OTHER_SEX", () => {
    const sample = {
      person: {
        sex: "OTHER_SEX",
      },
    } as Sample;
    expect(getSampleSexLabel(sample)).toBe("?");
  });

  test("getSampleSexLabel:UNKNOWN_SEX", () => {
    const sample = {
      person: {
        sex: "UNKNOWN_SEX",
      },
    } as Sample;
    expect(getSampleSexLabel(sample)).toBe("?");
  });

  test("getSampleAffectedStatusLabel:AFFECTED", () => {
    const sample = {
      person: {
        affectedStatus: "AFFECTED",
      },
    } as Sample;
    expect(getSampleAffectedStatusLabel(sample)).toBe("affected");
  });

  test("getSampleAffectedStatusLabel:UNAFFECTED", () => {
    const sample = {
      person: {
        affectedStatus: "UNAFFECTED",
      },
    } as Sample;
    expect(getSampleAffectedStatusLabel(sample)).toBe("unaffected");
  });

  test("getSampleAffectedStatusLabel:MISSING", () => {
    const sample = {
      person: {
        affectedStatus: "MISSING",
      },
    } as Sample;
    expect(getSampleAffectedStatusLabel(sample)).toBe("?");
  });

  test("getSampleMother", () => {
    expect(
      getSampleMother(sample, [
        sample,
        otherSiblingSample,
        otherFatherSample,
        otherMotherSample,
        siblingSample,
        fatherSample,
        motherSample,
      ]),
    ).toStrictEqual(motherSample);
  });

  test("getSampleMother:undefined", () => {
    expect(getSampleMother(sample, [sample, otherSiblingSample, otherFatherSample, otherMotherSample])).toBeUndefined();
  });

  test("getSampleFather", () => {
    expect(
      getSampleFather(sample, [
        sample,
        otherSiblingSample,
        otherMotherSample,
        otherFatherSample,
        siblingSample,
        motherSample,
        fatherSample,
      ]),
    ).toStrictEqual(fatherSample);
  });

  test("getSampleFather:undefined", () => {
    expect(getSampleFather(sample, [sample, otherSiblingSample, otherMotherSample, otherFatherSample])).toBeUndefined();
  });

  test("getSampleFamilyMembersWithoutParents", () => {
    expect(
      getSampleFamilyMembersWithoutParents(sample, [
        sample,
        otherSiblingSample,
        otherMotherSample,
        otherFatherSample,
        siblingSample,
        motherSample,
        fatherSample,
      ]),
    ).toStrictEqual([siblingSample]);
  });
});
