import { FieldMetadata, VcfMetadata } from "@molgenis/vip-report-vcf";
import { CompareFn, SortOrder, SortPath } from "@molgenis/vip-report-api";
import { ConfigSort, ConfigSortOrder } from "../types/configSort";
import { infoSortPath } from "./query.ts";

export type Direction = "asc" | "desc";

export type Order = {
  field: FieldMetadata;
  direction: Direction;
};

export type Sort = {
  orders: Order[];
};

export const DIRECTION_ASCENDING = "asc" as Direction;
export const DIRECTION_DESCENDING = "desc" as Direction;

class InvalidSortPathError extends Error {
  constructor(path: SortPath) {
    super(`invalid record sort path '[${path.join(",")}]'`);
    this.name = "InvalidSortPathError";
  }
}

export function createSort(
  storeSort: SortOrder | SortOrder[] | null,
  configSort: ConfigSort | undefined,
): SortOrder | SortOrder[] {
  if (storeSort) {
    return storeSort;
  } else {
    const sortOrders = configSort != undefined ? configSort.orders.map((order) => mapOrder(order)) : undefined;
    return sortOrders !== undefined ? sortOrders : [];
  }
}

export function mapOrder(sort: ConfigSortOrder): SortOrder {
  return {
    property: infoSortPath(sort.field),
    compare: createDirection(sort.direction),
  };
}

export function createRecordSort(recordsMeta: VcfMetadata, sort?: SortOrder | SortOrder[]): Sort {
  const orders = sort ? (Array.isArray(sort) ? sort : [sort]) : [];
  return { orders: orders.map((order) => createOrder(order, recordsMeta)) };
}

function createOrder(sort: SortOrder, recordsMeta: VcfMetadata): Order {
  return {
    field: createField(sort.property, recordsMeta),
    direction: createDirection(sort.compare),
  };
}

function createField(property: string | SortPath, recordsMeta: VcfMetadata): FieldMetadata {
  const path = Array.isArray(property) ? property : [property];
  if (path.length < 2 || path.length > 3 || path[0] !== "n" || typeof path[1] !== "string") {
    throw new Error(`invalid record sort path '[${path.join(",")}]'`);
  }

  const pathItem = path[1];
  if (typeof pathItem !== "string") throw new InvalidSortPathError(path);

  let field = recordsMeta.info[pathItem];
  if (field === undefined) throw new InvalidSortPathError(path);

  if (path.length === 3) {
    const pathIndex = path[2];
    if (typeof pathIndex !== "number") throw new InvalidSortPathError(path);
    if (field.nested === undefined) throw new InvalidSortPathError(path);

    field = field.nested.items[pathIndex];
    if (field === undefined) throw new InvalidSortPathError(path);
  }
  return field;
}

function createDirection(compare?: "asc" | "desc" | CompareFn): Direction {
  if (compare === undefined) return DIRECTION_ASCENDING;
  else if (compare === DIRECTION_ASCENDING) return DIRECTION_ASCENDING;
  else if (compare === DIRECTION_DESCENDING) return DIRECTION_DESCENDING;
  else if (typeof compare === "function") throw new Error("cannot convert sort with composed compare function");
  else throw new Error(`invalid sort compare '${compare}'`);
}
