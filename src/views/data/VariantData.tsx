import { createResource, Resource } from "solid-js";
import { RouteDataFuncArgs } from "@solidjs/router/dist/types";
import { EMPTY_RECORD_ITEM, fetchRecordById } from "../../utils/ApiUtils";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";

export type VariantRouteData = { variant: Resource<Item<Record>> };

export default function VariantData({ params }: RouteDataFuncArgs): VariantRouteData {
  const [variant] = createResource(() => params.variantId, fetchRecordById, { initialValue: EMPTY_RECORD_ITEM });
  return { variant };
}
