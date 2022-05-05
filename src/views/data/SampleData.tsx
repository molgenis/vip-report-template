import { createResource } from "solid-js";
import api from "../../Api";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";

const fetchSample = async (id: string) => await api.getSampleById(Number(id));

export default function SampleData({ params }: RouteDataFuncArgs) {
  const [sample] = createResource(() => params.sampleId, fetchSample);
  return sample;
}
