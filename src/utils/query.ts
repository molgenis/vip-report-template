import {
  Item,
  Query,
  QueryClause,
  QueryOperator,
  Sample,
  Selector,
  SelectorPart,
} from "@molgenis/vip-report-api/src/Api";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldMetadata, InfoMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterQueries } from "../store";

export function createQuery(
  search: string | undefined,
  filters: FilterQueries | undefined,
  metadata: Metadata
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
        ...createSearchQueryClausesInfo(search, infoMetadata.nested.items[i], [...selector, "*", i.toString()])
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

export function selector(field: FieldMetadata): Selector {
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

export function sampleSelector(sample: Item<Sample>, field: FieldMetadata) {
  const fieldSelector = selector(field) as SelectorPart[];
  return ["s", sample.data.index, ...fieldSelector];
}

export function selectorKey(selector: Selector): string {
  return Array.isArray(selector) ? selector.join("/") : selector.toString();
}

export function fieldKey(field: FieldMetadata): string {
  return selectorKey(selector(field));
}

export function infoFieldKey(field: FieldMetadata): string {
  return `n/${selectorKey(fieldKey(field))}`;
}

export function sampleFieldKey(sample: Sample, field: FieldMetadata): string {
  return `s/${sample.index}/${selectorKey(fieldKey(field))}`;
}
