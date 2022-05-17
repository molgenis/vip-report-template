import { createResource } from "solid-js";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";
import { fetchRecordById, fetchSampleById } from "../../utils/ApiUtils";

export default function SampleVariantData({ params }: RouteDataFuncArgs) {
  const [sample] = createResource(() => params.sampleId, fetchSampleById);
  const [variant] = createResource(() => params.variantId, fetchRecordById);
  return { sample, variant };
}
