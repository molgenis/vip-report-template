import {
  ConfigFilterFixed,
  FilterValueAlt,
  FilterValueChrom,
  FilterValueFilter,
  FilterValueFixed,
  FilterValueId,
  FilterValuePos,
  FilterValueQual,
  FilterValueRef,
} from "../../types/configFilter";
import { Query } from "@molgenis/vip-report-api";
import { UnexpectedEnumValueException } from "../error.ts";
import { createQueryFilterClosedInterval, createQueryFilterString } from "./queryFilter.ts";

export function createQueryFilterFixed(filter: ConfigFilterFixed, filterValue: FilterValueFixed): Query {
  let query: Query;
  switch (filter.id) {
    case "chrom":
      query = createQueryFilterString(["c"], filterValue as FilterValueChrom, false, false);
      break;
    case "pos":
      query = createQueryFilterClosedInterval(["p"], filterValue as FilterValuePos);
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
      query = createQueryFilterClosedInterval(["q"], filterValue as FilterValueQual);
      break;
    case "filter":
      query = createQueryFilterString(["f"], filterValue as FilterValueFilter, true, false);
      break;
    default:
      throw new UnexpectedEnumValueException(filter.id);
  }
  return query;
}
