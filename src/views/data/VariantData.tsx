import { createResource, Resource } from "solid-js";
import { RouteDataFuncArgs } from "solid-app-router/dist/types";
import { fetchRecordById } from "../../utils/ApiUtils";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";

export type VariantRouteData = { variant: Resource<Item<Record> | undefined> };

export default function VariantData({ params }: RouteDataFuncArgs): VariantRouteData {
  const [variant] = createResource(() => params.variantId, fetchRecordById);
  return { variant };
}
