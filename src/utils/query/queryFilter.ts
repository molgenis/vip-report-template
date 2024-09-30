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
import { CategoryRecord } from "@molgenis/vip-report-vcf";

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
  nestedValue: boolean,
  categories?: CategoryRecord, // TODO remove after resolving todo below
): Query {
  const nonNullFilterValues = filterValue.filter((value) => value !== "__null");

  const queryParts: Query[] = [];
  if (nonNullFilterValues.length > 0) {
    queryParts.push({
      selector,
      operator: nestedValue ? (multiValue ? "any_has_any" : "has_any") : multiValue ? "has_any" : "in",
      args: nonNullFilterValues,
    });
  }

  if (nonNullFilterValues.length < filterValue.length) {
    if (categories) {
      // workaround: use '!has_any' and '!any_has_any' since '== null' and '== []' do not work
      queryParts.push({
        selector,
        operator: nestedValue ? (multiValue ? "!any_has_any" : "!has_any") : multiValue ? "!has_any" : "!in",
        args: Object.keys(categories as CategoryRecord),
      });
    } else {
      throw new RuntimeError("query value 'null' not supported for non-categorical filters"); // TODO enable when vip-report-api issue fixed
    }
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
