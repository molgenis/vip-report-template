import { createResource, Resource } from "solid-js";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";
import { fetchSampleById } from "../../utils/ApiUtils";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";

export type SampleRouteData = { sample: Resource<Item<Sample> | undefined> };

export default function SampleData({ params }: RouteDataFuncArgs): SampleRouteData {
  const [sample] = createResource(() => params.sampleId, fetchSampleById);
  return { sample };
}
