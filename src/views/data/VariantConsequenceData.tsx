import { createResource } from "solid-js";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";
import { fetchRecordById } from "../../utils/ApiUtils";

export default function SampleVariantConsequenceData({ params }: RouteDataFuncArgs) {
  const [variant] = createResource(() => params.variantId, fetchRecordById);
  const consequenceId: number = parseInt(params.consequenceId);
  return { variant, consequenceId };
}
