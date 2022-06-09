import { Item, Sample } from "@molgenis/vip-report-api/src/Api";

export function getSampleLabel(sample: Item<Sample>) {
  return sample.data.person.individualId;
}
