import { createResource, Resource } from "solid-js";
import { RouteDataFuncArgs } from "@solidjs/router/dist/types";
import { EMPTY_SAMPLE_ITEM, fetchSampleById } from "../../utils/ApiUtils";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";

export type SampleParams = { sampleId: string };
export type SampleRouteData = { sample: Resource<Item<Sample>> };

export default function SampleData({ params }: RouteDataFuncArgs): SampleRouteData {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  const [sample] = createResource(() => params.sampleId, fetchSampleById, { initialValue: EMPTY_SAMPLE_ITEM });
  return { sample };
}
