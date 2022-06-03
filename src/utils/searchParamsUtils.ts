import { Params, Query, SortOrder } from "@molgenis/vip-report-api/src/Api";
import { Order, Sort } from "./sortUtils";

export type RecordSearchParams = { page?: string; size?: string; query?: string; sort?: string };

class InvalidSearchParamError extends Error {
  constructor(name: string, value: string) {
    super(`invalid '${name}' value '${value}'`);
    this.name = "InvalidSearchParamError";
  }
}

export function parseSearchParams(recordParams: RecordSearchParams): Params {
  const params: Params = {};

  if (recordParams.page) {
    const page = Number(recordParams.page);
    if (Number.isInteger(page) && page >= 0) {
      params.page = page;
    } else throw new InvalidSearchParamError("page", recordParams.page);
  }

  if (recordParams.size) {
    const size = Number(recordParams.size);
    if (Number.isInteger(size) && size >= 0) {
      params.size = size;
    } else throw new InvalidSearchParamError("size", recordParams.size);
  }

  if (recordParams.query) {
    try {
      params.query = JSON.parse(recordParams.query) as Query;
      // TODO validate that value is actually a Query
      // FIXME convert selector strings for index values to numbers
    } catch {
      throw new InvalidSearchParamError("query", recordParams.query);
    }
  }

  if (recordParams.sort) {
    console.log(recordParams.sort);
    try {
      params.sort = JSON.parse(recordParams.sort) as SortOrder | SortOrder[];
      // TODO validate that value is actually a SortOrder or SortOrder[]
      // FIXME convert selector strings for index values to numbers
    } catch {
      throw new InvalidSearchParamError("sort", recordParams.sort);
    }
  }

  return params;
}
