import { createResource } from "solid-js";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";
import { fetchRecordById, fetchSampleById } from "../../utils/ApiUtils";

export default function SampleVariantConsequenceData({ params }: RouteDataFuncArgs) {
  const [sample] = createResource(() => params.sampleId, fetchSampleById);
  const [variant] = createResource(() => params.variantId, fetchRecordById);
  const consequenceId: number = parseInt(params.consequenceId);
  return { sample, variant, consequenceId };
}
