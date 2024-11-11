import { ComposedQuery, Item, Query, Sample, Selector, SelectorPart, SortPath } from "@molgenis/vip-report-api";
import { CategoryRecord, FieldMetadata } from "@molgenis/vip-report-vcf";
import {
  ConfigFilter,
  ConfigFilterField,
  ConfigFilterFixed,
  ConfigFilterFormat,
  FilterValue,
  FilterValueAlt,
  FilterValueCategorical,
  FilterValueChrom,
  FilterValueFilter,
  FilterValueFixed,
  FilterValueId,
  FilterValueInterval,
  FilterValueMap,
  FilterValuePos,
  FilterValueQual,
  FilterValueRef,
  FilterValueString,
} from "../types/configFilter";
import { VariantType } from "./variantTypeUtils";

import { ConfigFilters } from "../types/config";
import { ConfigFilterComposed } from "../types/configFilterComposed";
import { createQueryFilterComposed } from "./queryComposed";
import { UnexpectedEnumValueException } from "./error";
import { SampleContainer } from "../Api.ts";
import { ConfigVip } from "../types/configVip";

type ComposedQueryOperator = "and" | "or"; //   TODO move to API.d.ts in vip-report-api

export function createQuery(
  variantType: VariantType,
  sample: SampleContainer | null,
  filterConfigs: ConfigFilters,
  filterValues: FilterValueMap,
  vipQuery: ComposedQuery | null,
): Query | null {
  const queryParts: Query[] = [];

  const queryVariantType = createQueryVariantType(variantType);
  if (queryVariantType !== null) {
    queryParts.push(queryVariantType);
  }

  if (sample !== null) {
    const querySample = createQuerySample(sample.item);
    queryParts.push(querySample);
  }

  const queryFilters = createQueryFilters(filterConfigs, filterValues);
  if (queryFilters !== null) {
    queryParts.push(queryFilters);
  }

  if (vipQuery !== null) {
    queryParts.push(vipQuery);
  }
  return queryParts.length > 0 ? createQueryComposed(queryParts, "and") : null;
}

export function createQueryComposed(queryParts: Query[], operator: ComposedQueryOperator): Query {
  const query: Query | null = createQueryComposedNullable(queryParts, operator);
  if (query === null) {
    throw new Error("query cannot be null");
  }
  return query;
}

function createQueryComposedNullable(queryParts: Query[], operator: ComposedQueryOperator): Query | null {
  let query: Query | null;
  if (queryParts.length === 0) {
    query = null;
  } else if (queryParts.length === 1) {
    query = queryParts[0]!;
  } else {
    query = { operator, args: queryParts };
  }
  return query;
}

export function createQuerySample(sample: Item<Sample>): Query {
  const selector: Selector = ["s", sample.data.index, "GT", "t"];

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

function createQueryFilterFixed(filter: ConfigFilterFixed, filterValue: FilterValueFixed): Query {
  let query: Query;
  switch (filter.id) {
    case "chrom":
      query = createQueryFilterString(["c"], filterValue as FilterValueChrom, false, false);
      break;
    case "pos":
      query = createQueryFilterInterval(["p"], filterValue as FilterValuePos);
      break;
    case "id":
      query = createQueryFilterString(["i"], filterValue as FilterValueId, true, false);
      break;
    case "ref":
      query = createQueryFilterString(["r"], filterValue as FilterValueRef, false, false);
      break;
    case "alt":
      query = createQueryFilterString(["a"], filterValue as FilterValueAlt, true, false);
      break;
    case "qual":
      query = createQueryFilterInterval(["q"], filterValue as FilterValueQual);
      break;
    case "filter":
      query = createQueryFilterString(["f"], filterValue as FilterValueFilter, true, false);
      break;
    default:
      throw new UnexpectedEnumValueException(filter.id);
  }
  return query;
}

function createQueryFilterField(filter: ConfigFilterField, filterValue: FilterValue): Query {
  const selector = createSelectorFilter(filter);
  const field = filter.field;

  let query: Query;
  switch (filter.field.type) {
    case "CATEGORICAL":
      query = createQueryFilterCategorical(selector, field, filterValue as FilterValueCategorical);
      break;
    case "CHARACTER":
    case "STRING":
      query = createQueryFilterFieldString(selector, field, filterValue as FilterValueString);
      break;
    case "FLOAT":
    case "INTEGER":
      query = createQueryFilterInterval(selector, filterValue as FilterValueInterval);
      break;
    case "FLAG":
      query = createQueryFilterFlag();
      break;
    default:
      throw new UnexpectedEnumValueException(field.type);
  }
  return query;
}

export function createQueryFilterCategorical(
  selector: Selector,
  field: FieldMetadata,
  filterValue: FilterValueCategorical,
): Query {
  const nonNullFilterValues = filterValue.filter((value) => value !== "__null");

  const queryParts: Query[] = [];
  if (nonNullFilterValues.length > 0) {
    queryParts.push({
      selector,
      operator: field.parent
        ? field.number.count === 1
          ? "has_any"
          : "any_has_any"
        : field.number.count === 1
          ? "in"
          : "has_any",
      args: nonNullFilterValues,
    });
  }

  if (nonNullFilterValues.length < filterValue.length) {
    // workaround: use '!has_any' and '!any_has_any' since '== null' and '== []' do not work
    queryParts.push({
      selector,
      operator: field.parent
        ? field.number.count === 1
          ? "!has_any"
          : "!any_has_any"
        : field.number.count === 1
          ? "!in"
          : "!has_any",
      args: Object.keys(field.categories as CategoryRecord),
    });
  }
  return createQueryComposed(queryParts, "or");
}

export function createQueryFilterInterval(selector: Selector, filterValue: FilterValueInterval): Query {
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

export function createQueryOusideFilterInterval(selector: Selector, filterValue: FilterValueInterval): Query {
  const queryParts: Query[] = [];
  if (filterValue.left !== undefined) {
    queryParts.push({
      selector,
      operator: "<=",
      args: filterValue.left,
    });
  }
  if (filterValue.right !== undefined) {
    queryParts.push({
      selector,
      operator: ">=",
      args: filterValue.right,
    });
  }
  const query = createQueryComposed(queryParts, "or");
  if (query === null) throw Error("query cannot be null");
  return query;
}

function createQueryFilterFlag(): Query {
  throw new Error("not implemented"); // FIXME support flag filter queries
}

function createQueryFilterFieldString(selector: Selector, field: FieldMetadata, filterValue: FilterValueString): Query {
  return createQueryFilterString(selector, filterValue, field.number.count !== 1, field.parent !== undefined);
}

function createQueryFilterString(
  selector: Selector,
  filterValue: FilterValueString,
  multiValue: boolean,
  nestedValue: boolean,
): Query {
  return {
    selector,
    operator: nestedValue ? (multiValue ? "any_has_any" : "has_any") : multiValue ? "has_any" : "in",
    args: filterValue,
  };
}

function createQueryVariantType(variantType: VariantType): Query | null {
  let query: Query | null;
  switch (variantType.id) {
    case "all":
      query = null;
      break;
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
      throw new UnexpectedEnumValueException(variantType.id);
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
    case "genotype":
      selector = createSelectorFilterFormat(filter as ConfigFilterFormat);
      break;
    case "info":
      selector = createSelectorFilterInfo(filter.field);
      break;
    case "composed":
    default:
      throw new UnexpectedEnumValueException(filter.type);
  }
  return selector;
}

export function createSelectorFilterFormat(filter: ConfigFilterFormat): SelectorPart[] {
  return ["s", filter.sample.item.data.index, ...selector(filter.field)];
}

export function createSelectorFilterInfo(field: FieldMetadata): SelectorPart[] {
  return ["n", ...selector(field)];
}

function createSelectorVariantType(): SelectorPart[] {
  return ["n", "SVTYPE"];
}

export function selector(field: FieldMetadata): SelectorPart[] {
  const selector: Selector = [];
  let currentField: FieldMetadata | undefined = field;
  do {
    if (currentField.parent && currentField.parent.nested) {
      const items = currentField.parent.nested.items;
      let i;
      for (i = 0; i < items.length; ++i) {
        if (items[i]!.id === currentField.id) {
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

export function infoSortPath(field: FieldMetadata): SortPath {
  return ["n", ...selector(field).filter((part) => part !== "*")];
}

export function createVipQueryClause(vipConfig: ConfigVip, sample: SampleContainer): ComposedQuery | null {
  const vipFilter = vipConfig.filter;
  if (vipFilter !== undefined) {
    const field = vipFilter.field;
    return {
      args: [
        {
          selector: ["s", sample.item.data.index, ...selector(field)],
          operator: "has_any",
          args: vipFilter.args,
        },
        {
          selector: ["s", sample.item.data.index, ...selector(field)],
          operator: field.parent
            ? field.number.count === 1
              ? "!has_any"
              : "!any_has_any"
            : field.number.count === 1
              ? "!in"
              : "!has_any",
          args: Object.keys(field.categories as CategoryRecord),
        },
      ],
      operator: "or",
    };
  }
  return null;
}
