import { RouteDataFuncArgs } from "@solidjs/router/dist/types";
import { VariantRouteData } from "./VariantData";

export type VariantConsequenceRouteData = { consequenceId: number } & VariantRouteData;

export default function VariantConsequenceData({ params, data }: RouteDataFuncArgs): VariantConsequenceRouteData {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  const consequenceId: number = parseInt(params.consequenceId);
  return { ...(data as VariantRouteData), consequenceId };
}
