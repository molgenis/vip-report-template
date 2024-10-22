import { Item, Sample } from "@molgenis/vip-report-api/src/Api";

export function getSampleLabel(sample: Item<Sample>) {
  console.log(sample);
  return sample.data.person.individualId;
}

export function getSampleSexLabel(sample: Item<Sample>): string {
  switch (sample.data.person.sex) {
    case "FEMALE":
      return "female";
    case "MALE":
      return "male";
    default:
      return "?";
  }
}

export function getSampleAffectedStatusLabel(sample: Item<Sample>): string {
  switch (sample.data.person.affectedStatus) {
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

export function isSampleMother(sample: Sample, samples: Sample): boolean {
  return isFamily(sample, samples) && samples.person.individualId === sample.person.maternalId;
}

export function isSampleFather(sample: Sample, samples: Sample): boolean {
  return isFamily(sample, samples) && samples.person.individualId === sample.person.paternalId;
}
