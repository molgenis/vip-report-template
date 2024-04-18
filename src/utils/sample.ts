import { Sample } from "@molgenis/vip-report-api/src/Api";

export function getSampleLabel(sample: Sample) {
  return sample.person.individualId;
}

export function getSampleSexLabel(sample: Sample): string {
  switch (sample.person.sex) {
    case "FEMALE":
      return "female";
    case "MALE":
      return "male";
    default:
      return "?";
  }
}

export function getSampleAffectedStatusLabel(sample: Sample): string {
  switch (sample.person.affectedStatus) {
    case "AFFECTED":
      return "affected";
    case "UNAFFECTED":
      return "unaffected";
    default:
      return "?";
  }
}

function isFamily(sample: Sample, samples: Sample): boolean {
  return sample.person.familyId === samples.person.familyId;
}

function isSampleMother(sample: Sample, samples: Sample): boolean {
  return isFamily(sample, samples) && samples.person.individualId === sample.person.maternalId;
}

export function getSampleMother(sample: Sample, samples: Sample[]): Sample | undefined {
  if (sample.person.maternalId !== "0") {
    for (const otherSample of samples) {
      if (isSampleMother(sample, otherSample)) return otherSample;
    }
  }
}

function isSampleFather(sample: Sample, samples: Sample): boolean {
  return isFamily(sample, samples) && samples.person.individualId === sample.person.paternalId;
}

export function getSampleFather(sample: Sample, samples: Sample[]): Sample | undefined {
  if (sample.person.paternalId !== "0") {
    for (const otherSample of samples) {
      if (isSampleFather(sample, otherSample)) return otherSample;
    }
  }
}

export function getSampleFamilyMembersWithoutParents(sample: Sample, samples: Sample[]): Sample[] {
  const familyMembersWithoutParents: Sample[] = [];
  for (const otherSample of samples) {
    if (isFamily(sample, otherSample) && !isSampleFather(sample, otherSample) && !isSampleMother(sample, otherSample)) {
      if (sample.person.individualId !== otherSample.person.individualId) familyMembersWithoutParents.push(otherSample);
    }
  }
  return familyMembersWithoutParents;
}
