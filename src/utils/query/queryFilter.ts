import {
  ConfigFilter,
  ConfigFilterField,
  FilterValue,
  FilterValueFixed,
  FilterValueInterval,
  FilterValueMap,
  FilterValueString,
} from "../../types/configFilter";
import { Query, Selector } from "@molgenis/vip-report-api";
import { createQueryFilterComposed } from "./queryFilterComposed.ts";
import { ConfigFilterComposed } from "../../types/configFilterComposed";
import { createQueryFilterFixed } from "./queryFilterFixed.ts";
import { RuntimeError, UnexpectedEnumValueException } from "../error.ts";
import { ConfigFilters } from "../../types/config";
import { createQueryComposed, createQueryComposedNullable } from "./query.ts";
import { createQueryFilterField } from "./queryFilterField.ts";

/**
 * Create API query for state of list of filters
 *
 * @param filterConfigs filter configurations
 * @param filterValues filter values
 */
export function createQueryFilters(filterConfigs: ConfigFilters, filterValues: FilterValueMap): Query | null {
  // TODO discuss: can we have id collisions between different types?
  const queryParts = filterConfigs
    .map((filter) => createQueryFilter(filter, filterValues[filter.id]!))
    .filter((query) => query !== null);
  return createQueryComposedNullable(queryParts, "and");
}

/**
 * Create API query for state of one filter
 *
 * @param filterConfig filter configuration
 * @param filterValue filter value
 */
function createQueryFilter(filterConfig: ConfigFilter, filterValue: FilterValue): Query | null {
  let query: Query | null;
  if (filterValue !== undefined) {
    switch (filterConfig.type) {
      case "composed":
        query = createQueryFilterComposed(filterConfig as ConfigFilterComposed, filterValue);
        break;
      case "fixed":
        query = createQueryFilterFixed(filterConfig, filterValue as FilterValueFixed);
        break;
      case "genotype":
      case "info":
        query = createQueryFilterField(filterConfig as ConfigFilterField, filterValue);
        break;
      default:
        throw new UnexpectedEnumValueException(filterConfig.type);
    }
  } else {
    query = null;
  }
  return query;
}

export function createQueryFilterString(
  selector: Selector,
  filterValue: FilterValueString,
  multiValue: boolean,
): Query {
  // null values
  // multi=false --> value=null
  // multi=true  --> value=[] or value=[..., null, ...]
  const filterValues = filterValue.map((value) => (value !== "__null" ? value : null));

  const queryParts: Query[] = [];
  if (filterValues.length > 0) {
    queryParts.push({
      selector,
      operator: "in",
      args: filterValues,
    });
  }

  if (multiValue && filterValues.findIndex((value) => value === null) !== -1) {
    queryParts.push({
      selector,
      operator: "==",
      args: multiValue ? [] : null,
    });
  }
  return createQueryComposed(queryParts, "or");
}

export function createQueryFilterClosedInterval(selector: Selector, filterValue: FilterValueInterval): Query {
  if (filterValue.left === undefined && filterValue.right === undefined) throw new RuntimeError();

  const queryParts: Query[] = [];
  if (filterValue.left !== undefined) {
    queryParts.push({
      selector,
      operator: ">=",
      args: filterValue.left,
    });
  }
  if (filterValue.right !== undefined) {
    queryParts.push({
      selector,
      operator: "<=",
      args: filterValue.right,
    });
  }
  return createQueryComposed(queryParts, "and");
}

export function createQueryFilterClosedIntervalOutside(selector: Selector, filterValue: FilterValueInterval): Query {
  if (filterValue.left === undefined && filterValue.right === undefined) throw new RuntimeError();

  const queryParts: Query[] = [];
  if (filterValue.left !== undefined) {
    queryParts.push({
      selector,
      operator: "<",
      args: filterValue.left,
    });
  }
  if (filterValue.right !== undefined) {
    queryParts.push({
      selector,
      operator: ">",
      args: filterValue.right,
    });
  }
  return createQueryComposed(queryParts, "or");
}
