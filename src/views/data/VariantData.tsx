import { createResource } from "solid-js";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";
import { fetchRecordById } from "../../utils/ApiUtils";

export default function VariantData({ params }: RouteDataFuncArgs) {
  const [variant] = createResource(() => params.variantId, fetchRecordById);
  return variant;
}
