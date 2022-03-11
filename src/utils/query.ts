import { ComposedQuery, Query, QueryOperator } from "../api/Api";
import { Metadata } from "../api/vcf/Vcf";
import { InfoMetadata } from "../api/vcf/MetadataParser";

export function createSearchQuery(search: string, metadata: Metadata): Query | ComposedQuery | null {
  const clauses: (Query | ComposedQuery)[] = [];
  for (const infoKey in metadata.info) {
    const infoMeta = metadata.info[infoKey];
    clauses.push(...createSearchQueryClausesInfo(search, infoMeta, ["n", infoMeta.id]));
  }
  console.log(clauses);
  return clauses.length == 0 ? null : clauses.length === 1 ? clauses[0] : { operator: "or", args: clauses };
}

function createSearchQueryClausesInfo(
  search: string,
  infoMetadata: InfoMetadata,
  selector: string[]
): (Query | ComposedQuery)[] {
  const clauses: (Query | ComposedQuery)[] = [];
  if (infoMetadata.nested) {
    for (let i = 0; i < infoMetadata.nested.items.length; ++i) {
      clauses.push(
        ...createSearchQueryClausesInfo(search, infoMetadata.nested.items[i], [...selector, "*", i.toString()])
      );
    }
  } else {
    switch (infoMetadata.type) {
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
