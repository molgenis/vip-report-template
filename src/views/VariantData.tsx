import { createResource } from "solid-js";
import api from "../Api";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";

const fetchVariant = async (id: string) => await api.getRecordById(Number(id));

export default function VariantData({ params }: RouteDataFuncArgs) {
  const [variant] = createResource(() => params.variantId, fetchVariant);
  return variant;
}
