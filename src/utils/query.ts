import {
  Item,
  Query,
  QueryClause,
  QueryOperator,
  Sample,
  Selector,
  SelectorPart,
  SortPath,
} from "@molgenis/vip-report-api/src/Api";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldMetadata, InfoMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterQueries } from "../store";
import {
  ConfigFilter,
  ConfigFilterField,
  ConfigFilterFormat,
  FilterValue,
  FilterValueCategorical,
  FilterValueInterval,
  FilterValueMap,
  FilterValueString,
} from "../types/filter";
import { VariantType } from "./variantTypeUtils";

import { SampleContainer } from "./sample";
import { ConfigFilters } from "../types/config";
import { ConfigFilterCustom, FilterValueLocus } from "../types/filterCustom";

type ComposedQueryOperator = "and" | "or"; // TODO move to API.d.ts in vip-report-api

export function createQuery(
  sample: SampleContainer,
  variantType: VariantType | null,
  filterConfigs: ConfigFilters,
  filterValues: FilterValueMap,
): Query {
  const queryParts: Query[] = [];

  const querySample = createQuerySample(sample);
  queryParts.push(querySample);

  if (variantType !== null) {
    const queryVariantType = createQueryVariantType(variantType);
    queryParts.push(queryVariantType);
  }

  const queryFilters = createQueryFilters(filterConfigs, filterValues);
  if (queryFilters !== null) {
    queryParts.push(queryFilters);
  }
  console.log("query", JSON.stringify(createQueryComposed(queryParts, "and")));
  return createQueryComposed(queryParts, "and");
}

function createQueryComposed(queryParts: Query[], operator: ComposedQueryOperator): Query {
  const query: Query | null = createQueryComposedNullable(queryParts, operator);
  if (query == null) {
    throw new Error("query cannot be null");
  }
  return query;
}

function createQueryComposedNullable(queryParts: Query[], operator: ComposedQueryOperator): Query | null {
  let query: Query | null;
  if (queryParts.length === 0) {
    query = null;
  } else if (queryParts.length === 1) {
    query = queryParts[0];
  } else {
    query = { operator, args: queryParts };
  }
  return query;
}

function createQuerySample(sample: SampleContainer): Query {
  const selector: Selector = ["s", sample.item.data.index, "GT", "t"];

  const queryParts: Query[] = [
    { selector, operator: "!=", args: "hom_r" },
    { selector, operator: "!=", args: "miss" },
  ];
  return createQueryComposed(queryParts, "and");
}

/**
 * Create API query for state of list of filters
 *
 * @param filterConfigs filter configurations
 * @param filterValues filter values
 */
function createQueryFilters(filterConfigs: ConfigFilters, filterValues: FilterValueMap): Query | null {
  const queryParts = filterConfigs
    .map((filter) => createQueryFilter(filter, filterValues[filter.id]))
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
      case "custom":
        query = createQueryFilterCustom(filterConfig as ConfigFilterCustom, filterValue);
        break;
      case "format":
      case "info":
        query = createQueryFilterField(filterConfig as ConfigFilterField, filterValue);
        break;
      default:
        throw new Error(`unexpected filter type '${filterConfig.type}'`);
    }
  } else {
    query = null;
  }
  return query;
}

function createQueryFilterCustom(filter: ConfigFilterCustom, filterValue: FilterValue): Query {
  let query: Query;
  switch (filter.id) {
    case "custom/locus":
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

function createQueryFilterField(filter: ConfigFilterField, filterValue: FilterValue): Query {
  let query: Query;
  switch (filter.field.type) {
    case "CATEGORICAL":
      query = createQueryFilterCategorical(filter, filterValue as FilterValueCategorical);
      break;
    case "CHARACTER":
    case "STRING":
      query = createQueryFilterString(filter, filterValue as FilterValueString);
      break;
    case "INTEGER":
      query = createQueryFilterInteger(filter, filterValue as FilterValueInterval);
      break;
    case "FLAG":
      query = createQueryFilterFlag(filter, filterValue);
      break;
    case "FLOAT":
      query = createQueryFilterFloat(filter, filterValue);
      break;
    default:
      throw new Error(`unexpected field type ${filter.field.type}`);
  }
  return query;
}

function createQueryFilterCategorical(filter: ConfigFilterField, filterValue: FilterValueCategorical): Query {
  const selector = createSelectorFilter(filter);
  const nonNullFilterValues = filterValue.filter((value) => value !== "__null");

  const queryParts: Query[] = [];
  if (nonNullFilterValues.length > 0) {
    queryParts.push({
      selector,
      operator: filter.field.number.count === 1 ? "has_any" : "any_has_any",
      args: nonNullFilterValues,
    });
  }

  if (nonNullFilterValues.length < filterValue.length) {
    // workaround: use '!has_any' and '!any_has_any' since '== null' and '== []' do not work
    queryParts.push({
      selector,
      operator: filter.field.number.count === 1 ? "!has_any" : "!any_has_any",
      args: filter.field.categories,
    });
  }
  return createQueryComposed(queryParts, "or");
}

function createQueryFilterInteger(filter: ConfigFilterField, filterValue: FilterValueInterval): Query {
  const selector = createSelectorFilter(filter);

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
  const query = createQueryComposed(queryParts, "and");
  if (query === null) throw Error("query cannot be null");
  return query;
}

function createQueryFilterFlag(filter: ConfigFilterField, filterValue: FilterValue): Query {
  throw new Error("FIXME implement:" + filter + "," + filterValue);
}

function createQueryFilterFloat(filter: ConfigFilterField, filterValue: FilterValue): Query {
  throw new Error("FIXME implement:" + filter + "," + filterValue);
}

function createQueryFilterString(filter: ConfigFilterField, filterValue: FilterValueString): Query {
  return {
    selector: createSelectorFilter(filter),
    operator: filter.field.number.count === 1 ? "has_any" : "any_has_any",
    args: filterValue,
  };
}

function createQueryVariantType(variantType: VariantType): Query {
  let query: Query;
  switch (variantType.id) {
    case "snv":
      query = createQueryVariantTypeSnv();
      break;
    case "str":
      query = createQueryVariantTypeStr();
      break;
    case "sv":
      query = createQueryVariantTypeSv();
      break;
    default:
      throw new Error(`unexpected variant type ${variantType.id}`);
  }
  return query;
}

function createQueryVariantTypeSnv(): Query {
  const queryParts: Query[] = [
    {
      selector: createSelectorVariantType(),
      operator: "==",
      args: null,
    },
    {
      selector: createSelectorVariantType(),
      operator: "==",
      args: undefined,
    },
  ];
  return createQueryComposed(queryParts, "or");
}

function createQueryVariantTypeStr(): Query {
  return {
    selector: createSelectorVariantType(),
    operator: "==",
    args: "STR",
  };
}

function createQueryVariantTypeSv(): Query {
  return {
    operator: "and",
    args: [
      {
        selector: createSelectorVariantType(),
        operator: "!=",
        args: "STR",
      },
      {
        selector: createSelectorVariantType(),
        operator: "!=",
        args: null,
      },
      {
        selector: createSelectorVariantType(),
        operator: "!=",
        args: undefined,
      },
    ],
  };
}

function createSelectorFilter(filter: ConfigFilterField) {
  let selector: SelectorPart[];
  switch (filter.type) {
    case "format":
      selector = createSelectorFilterFormat(filter as ConfigFilterFormat);
      break;
    case "info":
      selector = createSelectorFilterInfo(filter);
      break;
    case "custom":
    default:
      throw new Error(`unexpected filter type '${filter.type}'`);
  }
  return selector;
}

function createSelectorFilterFormat(filter: ConfigFilterFormat): SelectorPart[] {
  return ["s", filter.sample.item.data.index, ...selector(filter.field)];
}

function createSelectorFilterInfo(filter: ConfigFilterField): SelectorPart[] {
  return ["n", ...selector(filter.field)];
}

function createSelectorVariantType(): SelectorPart[] {
  return ["n", "SVTYPE"];
}

// TODO cleanup - start

export function createSampleQuery(
  sample: Item<Sample>,
  search: string | undefined,
  filters: FilterQueries | undefined,
  metadata: Metadata,
): Query | null {
  const genotypeSelector: Selector = ["s", sample.data.index, "GT", "t"];
  const sampleQuery: Query = {
    operator: "and",
    args: [
      { selector: genotypeSelector, operator: "!=", args: "hom_r" },
      { selector: genotypeSelector, operator: "!=", args: "miss" },
    ],
  };
  const searchFilterQuery = createQueryOld(search, filters, metadata);
  return searchFilterQuery !== null ? { operator: "and", args: [sampleQuery, searchFilterQuery] } : sampleQuery;
}

export function createQueryOld(
  search: string | undefined,
  filters: FilterQueries | undefined,
  metadata: Metadata,
): Query | null {
  let query: Query | null;

  const searchQuery = search !== undefined ? createSearchQuery(search, metadata) : null;
  const filterQuery = filters !== undefined ? createFilterQuery(filters) : null;
  if (searchQuery !== null) {
    query = filterQuery !== null ? { operator: "and", args: [searchQuery, filterQuery] } : searchQuery;
  } else {
    query = filterQuery !== null ? filterQuery : null;
  }
  return query;
}

export function createSearchQuery(search: string, metadata: Metadata): Query | null {
  const parts: Query[] = [];
  for (const infoKey in metadata.info) {
    const infoMeta = metadata.info[infoKey];
    parts.push(...createSearchQueryClausesInfo(search, infoMeta, ["n", infoMeta.id]));
  }
  return parts.length == 0 ? null : parts.length === 1 ? parts[0] : { operator: "or", args: parts };
}

function createSearchQueryClausesInfo(search: string, infoMetadata: InfoMetadata, selector: string[]): Query[] {
  const clauses: Query[] = [];
  if (infoMetadata.nested) {
    for (let i = 0; i < infoMetadata.nested.items.length; ++i) {
      clauses.push(
        ...createSearchQueryClausesInfo(search, infoMetadata.nested.items[i], [...selector, "*", i.toString()]),
      );
    }
  } else {
    switch (infoMetadata.type) {
      case "CATEGORICAL":
      case "CHARACTER":
      case "STRING": {
        const nested = selector.find((item) => item === "*") !== undefined;
        let operator: QueryOperator, args;
        if (infoMetadata.number.count && infoMetadata.number.count === 1) {
          operator = nested ? "~=_any" : "~=";
          args = nested ? [search] : search;
        } else {
          operator = nested ? "any_~=_any" : "~=_any";
          args = [search];
        }
        clauses.push({ selector, operator, args });
        break;
      }
      default:
        break;
    }
  }
  return clauses;
}

function createFilterQuery(queries: FilterQueries): Query | null {
  const queryClauses = Object.values(queries).filter((query) => query !== undefined) as QueryClause[];
  if (queryClauses.length === 0) return null;
  return queryClauses.length === 1 ? queryClauses[0] : { operator: "and", args: queryClauses };
}

export function selector(field: FieldMetadata): SelectorPart[] {
  const selector: Selector = [];
  let currentField: FieldMetadata | undefined = field;
  do {
    if (currentField.parent && currentField.parent.nested) {
      const items = currentField.parent.nested.items;
      let i;
      for (i = 0; i < items.length; ++i) {
        if (items[i].id === currentField.id) {
          break;
        }
      }
      selector.push(i);
      if (currentField.parent.number.count !== 1) {
        selector.push("*");
      }
    } else {
      selector.push(currentField.id);
    }
    currentField = currentField.parent;
  } while (currentField);
  selector.reverse();
  return selector;
}

export function infoSelector(field: FieldMetadata) {
  return ["n", ...selector(field)];
}

export function sampleSelector(sample: Item<Sample>, field: FieldMetadata) {
  return ["s", sample.data.index, ...selector(field)];
}

export function selectorKey(selector: Selector): string {
  return Array.isArray(selector) ? selector.join("/") : selector.toString();
}

export function infoFieldKey(field: FieldMetadata): string {
  return selectorKey(infoSelector(field));
}

export function sampleFieldKey(sample: Item<Sample>, field: FieldMetadata): string {
  return selectorKey(sampleSelector(sample, field));
}

export function sampleCustomKey(sample: Item<Sample>, key: string): string {
  return selectorKey(["s", sample.data.index, key]);
}

function sortPath(field: FieldMetadata): SortPath {
  return selector(field).filter((part) => part !== "*");
}

export function infoSortPath(field: FieldMetadata): SortPath {
  return ["n", ...sortPath(field)];
}
// TODO cleanup - stop
