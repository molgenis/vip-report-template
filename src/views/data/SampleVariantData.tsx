import { createResource, Resource } from "solid-js";
import { RouteDataFuncArgs } from "@solidjs/router/dist/types";
import { fetchRecordById } from "../../utils/ApiUtils";
import { SampleRouteData } from "./SampleData";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";

export type SampleVariantRouteData = SampleRouteData & { variant: Resource<Item<Record> | undefined> };

export default function SampleVariantData({ params, data }: RouteDataFuncArgs): SampleVariantRouteData {
  const [variant] = createResource(() => params.variantId, fetchRecordById);
  return { ...(data as SampleRouteData), variant };
}
