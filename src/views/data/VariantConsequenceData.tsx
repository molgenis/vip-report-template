import { createResource } from "solid-js";
import api from "../../Api";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";

const fetchVariant = async (id: string) => await api.getRecordById(Number(id));

export default function SampleVariantConsequenceData({ params }: RouteDataFuncArgs) {
  const [variant] = createResource(() => params.variantId, fetchVariant);
  const consequenceId: string = params.consequenceId;
  return { variant, consequenceId };
}
