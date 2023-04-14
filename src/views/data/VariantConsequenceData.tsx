import { RouteDataFuncArgs } from "@solidjs/router/dist/types";
import { VariantRouteData } from "./VariantData";

export type VariantConsequenceRouteData = { consequenceId: number } & VariantRouteData;

export default function VariantConsequenceData({ params, data }: RouteDataFuncArgs): VariantConsequenceRouteData {
  const consequenceId: number = parseInt(params.consequenceId);
  return { ...(data as VariantRouteData), consequenceId };
}
