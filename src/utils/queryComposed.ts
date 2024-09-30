import { ConfigFilterComposed, ConfigFilterHpo, FilterValueHpo, FilterValueLocus } from "../types/configFilterComposed";
import { FilterValue } from "../types/configFilter";
import { Query } from "@molgenis/vip-report-api/src/Api";
import { createQueryComposed, createQueryFilterCategorical, createSelectorFilterInfo } from "./query";

export function createQueryFilterComposed(filter: ConfigFilterComposed, filterValue: FilterValue): Query {
  let query: Query;
  switch (filter.id) {
    case "hpo":
      query = createQueryFilterHpo(filter as ConfigFilterHpo, filterValue as FilterValueHpo);
      break;
    case "locus":
      query = createQueryFilterLocus(filterValue as FilterValueLocus);
      break;
    default:
      throw new Error(`unexpected filter id '${filter.id}'`);
  }
  return query;
}

function createQueryFilterHpo(filter: ConfigFilterHpo, filterValue: FilterValueHpo): Query {
  const field = filter.field;
  const selector = createSelectorFilterInfo(field);
  return createQueryFilterCategorical(selector, field, filterValue);
}

function createQueryFilterLocus(filterValue: FilterValueLocus): Query {
  const queryParts: Query[] = [
    {
      operator: "==",
      selector: "c",
      args: filterValue.chromosome,
    },
  ];
  if (filterValue.start !== undefined) {
    queryParts.push({
      operator: ">=",
      selector: "p",
      args: filterValue.start,
    });
  }
  if (filterValue.end !== undefined) {
    queryParts.push({
      operator: "<=",
      selector: "p",
      args: filterValue.end,
    });
  }
  return createQueryComposed(queryParts, "and");
}
