import { Query, QueryClause, QueryOperator, Selector } from "@molgenis/vip-report-api/src/Api";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldMetadata, InfoMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent } from "../components/filter/Filters";
import { FormatFilterChangeEvent } from "../components/filter/FormatFilters";

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

export function getSelector(fieldMetadata: FieldMetadata): Selector {
  const selector: Selector = [];
  let currentFieldMetadata: FieldMetadata | undefined = fieldMetadata;
  do {
    if (currentFieldMetadata.parent && currentFieldMetadata.parent.nested) {
      const items = currentFieldMetadata.parent.nested.items;
      let i;
      for (i = 0; i < items.length; ++i) {
        if (items[i].id === currentFieldMetadata.id) {
          break;
        }
      }
      selector.push(i);
      if (currentFieldMetadata.parent.number.count !== 1) {
        selector.push("*");
      }
    } else {
      selector.push(currentFieldMetadata.id);
      selector.push("n");
    }
    currentFieldMetadata = currentFieldMetadata.parent;
  } while (currentFieldMetadata);
  selector.reverse();
  return selector;
}

function addCategoricalFilterClause(filter: FilterChangeEvent, clauses: QueryClause[]) {
  const categories = filter.value;
  clauses.push({
    selector: getSelector(filter.field),
    operator: filter.field.number.count === 1 ? "has_any" : "any_has_any",
    args: categories,
  });
}

export function createFilterQuery(filters: FilterChangeEvent[]): Query {
  const clauses: QueryClause[] = [];
  for (const filter of filters) {
    switch (filter.field.type) {
      case "CATEGORICAL": {
        addCategoricalFilterClause(filter, clauses);
        break;
      }
      case "CHARACTER":
      case "FLAG":
      case "FLOAT":
      case "INTEGER":
      case "STRING":
        throw new Error("invalid field type");
      default:
        throw new Error("unknown field type");
    }
  }
  return clauses.length === 1 ? clauses[0] : { operator: "and", args: clauses };
}

export function createFormatFilterQuery(filters: FormatFilterChangeEvent[], sampleId: number): Query {
  const clauses: QueryClause[] = [];
  for (const filter of filters) {
    clauses.push({
      selector: ["s", sampleId, filter.fieldMetadata.id],
      operator: filter.operator,
      args: filter.value != null ? filter.value : "",
    });
  }
  return clauses.length === 1 ? clauses[0] : { operator: "and", args: clauses };
}
