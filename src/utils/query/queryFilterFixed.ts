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
    case "fixed/chrom":
      query = createQueryFilterString(["c"], filterValue as FilterValueChrom, false, false);
      break;
    case "fixed/pos":
      query = createQueryFilterClosedInterval(["p"], filterValue as FilterValuePos);
      break;
    case "fixed/id":
      query = createQueryFilterString(["i"], filterValue as FilterValueId, true, false);
      break;
    case "fixed/ref":
      query = createQueryFilterString(["r"], filterValue as FilterValueRef, false, false);
      break;
    case "fixed/alt":
      query = createQueryFilterString(["a"], filterValue as FilterValueAlt, true, false);
      break;
    case "fixed/qual":
      query = createQueryFilterClosedInterval(["q"], filterValue as FilterValueQual);
      break;
    case "fixed/filter":
      query = createQueryFilterString(["f"], filterValue as FilterValueFilter, true, false);
      break;
    default:
      throw new UnexpectedEnumValueException(filter.id);
  }
  return query;
}
