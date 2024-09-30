import { Item, Sample } from "@molgenis/vip-report-api";
import { SampleContainer } from "./api.ts";

export function getSampleLabel(sample: Item<Sample>) {
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

export function isSampleMother(sample: Sample, sampleMaternal: Sample): boolean {
  return isFamily(sample, sampleMaternal) && sampleMaternal.person.individualId === sample.person.maternalId;
}

export function isSampleFather(sample: Sample, samplePaternal: Sample): boolean {
  return isFamily(sample, samplePaternal) && samplePaternal.person.individualId === sample.person.paternalId;
}

/**
 * Returns all samples for the given sample pedigree including the given sample itself
 */
export function getPedigreeSamples(sample: SampleContainer): Item<Sample>[] {
  return [sample.item, sample.maternalSample, sample.paternalSample, ...sample.otherPedigreeSamples].filter(
    (sample) => sample !== null,
  );
}
