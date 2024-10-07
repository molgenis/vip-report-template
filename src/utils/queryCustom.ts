import { ConfigFilterCustom, FilterValueLocus } from "../types/configFilterCustom";
import { FilterValue } from "../types/configFilter";
import { Query } from "@molgenis/vip-report-api/src/Api";
import { createQueryComposed } from "./query";

export function createQueryFilterCustom(filter: ConfigFilterCustom, filterValue: FilterValue): Query {
  let query: Query;
  switch (filter.id) {
    case "locus":
      query = createQueryFilterCustomLocus(filterValue as FilterValueLocus);
      break;
    default:
      throw new Error(`unexpected filter id '${filter.id}'`);
  }
  return query;
}

function createQueryFilterCustomLocus(filterValue: FilterValueLocus): Query {
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
