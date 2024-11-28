import { Query, SelectorPart } from "@molgenis/vip-report-api";
import { VariantType } from "../variantType.ts";
import { UnexpectedEnumValueException } from "../error.ts";
import { createQueryComposed } from "./query.ts";

export function createQueryVariantType(variantType: VariantType): Query | null {
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

function createSelectorVariantType(): SelectorPart[] {
  return ["n", "SVTYPE"];
}
