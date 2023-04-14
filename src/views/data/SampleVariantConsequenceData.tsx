import { RouteDataFuncArgs } from "@solidjs/router/dist/types";
import { SampleVariantRouteData } from "./SampleVariantData";

export type SampleVariantConsequenceRouteData = { consequenceId: number } & SampleVariantRouteData;

export default function SampleVariantConsequenceData({
  params,
  data,
}: RouteDataFuncArgs): SampleVariantConsequenceRouteData {
  const consequenceId: number = parseInt(params.consequenceId);
  return { ...(data as SampleVariantRouteData), consequenceId };
}
