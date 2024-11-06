import { Query, SelectorPart } from "@molgenis/vip-report-api";
import { createQueryComposed } from "./query";

export function createNotBetweenClauses(viabSelector: SelectorPart[], from: number, to: number) {
  const queryParts: Query[] = [];
  queryParts.push({
    operator: "<=",
    selector: viabSelector,
    args: from,
  });
  queryParts.push({
    operator: ">=",
    selector: viabSelector,
    args: to,
  });
  return createQueryComposed(queryParts, "or");
}

export function createBetweenClauses(viabSelector: SelectorPart[], from: number, to: number) {
  const queryParts: Query[] = [];
  queryParts.push({
    operator: ">=",
    selector: viabSelector,
    args: from,
  });
  queryParts.push({
    operator: "<=",
    selector: viabSelector,
    args: to,
  });
  return createQueryComposed(queryParts, "and");
}
