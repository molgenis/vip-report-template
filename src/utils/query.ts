import { Query, QueryClause, QueryOperator } from "../api/Api";
import { Metadata } from "../api/vcf/Vcf";
import { InfoMetadata } from "../api/vcf/MetadataParser";
import { FilterChangeEvent, FilterValueCategorical } from "./filter";

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
          operator = nested ? "has_any" : "==";
          args = nested ? [search] : search;
        } else {
          operator = nested ? "any_has_any" : "has_any";
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

export function createFilterQuery(filters: FilterChangeEvent[]): Query {
  const clauses: QueryClause[] = [];
  for (const filter of filters) {
    switch (filter.fieldMetadata.type) {
      case "CATEGORICAL": {
        const categories = filter.value as FilterValueCategorical;
        clauses.push({
          selector: ["n", "CSQ", "*", 2],
          operator: categories.length === 1 ? "has_any" : "any_has_any",
          args: categories,
        });
        break;
      }
      case "CHARACTER":
      case "FLAG":
      case "FLOAT":
      case "INTEGER":
      case "NESTED":
      case "STRING":
        throw new Error("invalid field type");
      default:
        throw new Error("unknown field type");
    }
  }
  return clauses.length === 1 ? clauses[0] : { operator: "or", args: clauses };
}
