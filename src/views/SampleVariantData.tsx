import { createResource } from "solid-js";
import api from "../Api";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";

const fetchSample = async (id: string) => await api.getSampleById(Number(id));
const fetchVariant = async (id: string) => await api.getRecordById(Number(id));

export default function SampleVariantData({ params }: RouteDataFuncArgs) {
  const [sample] = createResource(() => params.sampleId, fetchSample);
  const [variant] = createResource(() => params.variantId, fetchVariant);
  return { sample, variant };
}
