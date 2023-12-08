import { RouteDataFuncArgs } from "@solidjs/router/dist/types";
import { SampleVariantRouteData } from "./SampleVariantData";

export type SampleVariantConsequenceRouteData = { consequenceId: number } & SampleVariantRouteData;

export default function SampleVariantConsequenceData({
  params,
  data,
}: RouteDataFuncArgs): SampleVariantConsequenceRouteData {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  const consequenceId: number = parseInt(params.consequenceId);
  return { ...(data as SampleVariantRouteData), consequenceId };
}
