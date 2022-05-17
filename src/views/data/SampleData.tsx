import { createResource } from "solid-js";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";
import { fetchSampleById } from "../../utils/ApiUtils";

export default function SampleData({ params }: RouteDataFuncArgs) {
  const [sample] = createResource(() => params.sampleId, fetchSampleById);
  return sample;
}
