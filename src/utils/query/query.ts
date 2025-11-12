import { ComposedQueryOperator, Query } from "@molgenis/vip-report-api";
import { FilterValueMap } from "../../types/configFilter";
import { VariantType } from "../variantType.ts";

import { Config } from "../../types/config";
import { MetadataContainer, SampleContainer } from "../api.ts";
import { createQueryFilters } from "./queryFilter.ts";
import { createQueryVariantType } from "./queryVariantType.ts";
import { createQuerySample } from "./querySample.ts";

export function createQuery(
  config: Config,
  meta: MetadataContainer,
  variantType: VariantType,
  sample: SampleContainer | null,
  filterValues: FilterValueMap,
): Query | null {
  const queryParts: Query[] = [];

  const queryVariantType = createQueryVariantType(variantType);
  if (queryVariantType !== null) {
    queryParts.push(queryVariantType);
  }

  if (sample !== null) {
    const querySample = createQuerySample(config.vip, sample, meta);
    if (querySample !== null) {
      queryParts.push(querySample);
    }
  }

  const queryFilters = createQueryFilters(config.variants.filters, filterValues);
  if (queryFilters !== null) {
    queryParts.push(queryFilters);
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

export function createQueryComposedNullable(queryParts: Query[], operator: ComposedQueryOperator): Query | null {
  let query: Query | null;
  if (queryParts.length === 0) {
    query = null;
  } else if (queryParts.length === 1) {
    query = queryParts[0]!;
  } else {
    query = { operator, args: queryParts }; // TODO simplify query is all query parts are composed queries with the same operator as the given operator
  }
  return query;
}
