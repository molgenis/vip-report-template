import { ConfigStaticFieldInfo, ConfigStaticSort, ConfigStaticSortOrder } from "../types/config";
import { UnexpectedEnumValueException } from "./error";
import { FieldMap } from "./utils.ts";
import { ConfigSortOrder, ConfigSorts } from "../types/configSort";
import { MetadataContainer } from "../Api.ts";

export function initConfigSorts(configStaticSorts: ConfigStaticSort[], metadata: MetadataContainer): ConfigSorts {
  return configStaticSorts.flatMap((configStaticSort) => {
    return createConfigSortOptions(configStaticSort, metadata.records.fieldMap);
  });
}

function createConfigSortOrders(configStaticSort: ConfigStaticSort, fieldMap: FieldMap): ConfigSortOrder[] {
  const configSortOrders = configStaticSort.orders.map((order) => createConfigSortOrder(order, fieldMap));
  return configSortOrders.filter((configSortOrder) => configSortOrder !== null);
}

function createConfigSortOptions(configStaticSort: ConfigStaticSort, fieldMap: FieldMap) {
  return { selected: configStaticSort.selected, orders: createConfigSortOrders(configStaticSort, fieldMap) };
}

function createConfigSortOrderInfo(configStatic: ConfigStaticSortOrder, fieldMap: FieldMap): ConfigSortOrder | null {
  const configField: ConfigStaticFieldInfo = configStatic.field as ConfigStaticFieldInfo;
  const field = fieldMap[`INFO/${configField.name}`];
  return field !== undefined ? { direction: configStatic.direction, field: field } : null;
}

function createConfigSortOrder(order: ConfigStaticSortOrder, fieldMap: FieldMap) {
  let configSortOrder: ConfigSortOrder | null;
  switch (order.field.type) {
    case "info":
      configSortOrder = createConfigSortOrderInfo(order, fieldMap);
      break;
    case "fixed":
    case "genotype":
    case "composed":
    case "format":
      throw new Error(`unsupported config filter type '${order.field.type}'`); // not exposed by vip-report-api
    default:
      throw new UnexpectedEnumValueException(order.field.type);
  }
  return configSortOrder;
}
