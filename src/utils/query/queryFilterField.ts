import { Query, Selector, SelectorPart } from "@molgenis/vip-report-api";
import { FieldMetadata } from "@molgenis/vip-report-vcf";
import {
  ConfigFilterField,
  ConfigFilterFormat,
  FilterValue,
  FilterValueCategorical,
  FilterValueInterval,
  FilterValueString,
} from "../../types/configFilter";
import { UnexpectedEnumValueException } from "../error.ts";
import { createSelectorInfo, createSelectorSample } from "./selector.ts";
import { createQueryFilterClosedInterval, createQueryFilterString } from "./queryFilter.ts";

export function createQueryFilterField(filter: ConfigFilterField, filterValue: FilterValue): Query {
  const selector = createSelectorFilter(filter);
  const field = filter.field;

  let query: Query;
  switch (filter.field.type) {
    case "CATEGORICAL":
      query = createQueryFilterFieldCategorical(selector, field, filterValue as FilterValueCategorical);
      break;
    case "CHARACTER":
    case "STRING":
      query = createQueryFilterFieldString(selector, field, filterValue as FilterValueString);
      break;
    case "FLOAT":
    case "INTEGER":
      query = createQueryFilterClosedInterval(selector, filterValue as FilterValueInterval);
      break;
    case "FLAG":
      query = createQueryFilterFlag();
      break;
    default:
      throw new UnexpectedEnumValueException(field.type);
  }
  return query;
}

function createSelectorFilter(filter: ConfigFilterField) {
  let selector: SelectorPart[];
  switch (filter.type) {
    case "genotype":
      selector = createSelectorSample((filter as ConfigFilterFormat).sample, filter.field);
      break;
    case "info":
      selector = createSelectorInfo(filter.field);
      break;
    case "composed":
    default:
      throw new UnexpectedEnumValueException(filter.type);
  }
  return selector;
}

export function createQueryFilterFieldCategorical(
  selector: Selector,
  field: FieldMetadata,
  filterValue: FilterValueCategorical,
): Query {
  const multiValue = field.number.count !== 1;
  const nestedValue = field.parent !== undefined;
  return createQueryFilterString(selector, filterValue, multiValue, nestedValue);
}

function createQueryFilterFlag(): Query {
  throw new Error("not implemented"); // FIXME support flag filter queries
}

function createQueryFilterFieldString(selector: Selector, field: FieldMetadata, filterValue: FilterValueString): Query {
  const multiValue = field.number.count !== 1;
  const nestedValue = field.parent !== undefined;
  return createQueryFilterString(selector, filterValue, multiValue, nestedValue);
}
