import { ConfigStaticFieldInfo, ConfigStaticSort, ConfigStaticSortOrder } from "../../types/config";
import { UnexpectedEnumValueException } from "../error.ts";
import { ConfigSort, ConfigSortOrder, ConfigSorts } from "../../types/configSort";
import { MetadataContainer, VcfMetadataContainer } from "../api.ts";
import { getInfoField } from "../vcf.ts";

export function initConfigSorts(configs: ConfigStaticSort[], metadata: MetadataContainer): ConfigSorts {
  return configs
    .flatMap((configStaticSort) => createConfigSort(configStaticSort, metadata.records))
    .filter((configSort) => configSort !== null);
}

function createConfigSortOrders(config: ConfigStaticSort, metadata: VcfMetadataContainer): ConfigSortOrder[] {
  const configSortOrders = config.orders.map((order) => createConfigSortOrder(order, metadata));
  return configSortOrders.filter((configSortOrder) => configSortOrder !== null);
}

function createConfigSort(config: ConfigStaticSort, metadata: VcfMetadataContainer): ConfigSort | null {
  const orders = createConfigSortOrders(config, metadata);
  return orders.length !== 0 ? { selected: config.selected, orders } : null;
}

function createConfigSortOrder(order: ConfigStaticSortOrder, metadata: VcfMetadataContainer) {
  let configSortOrder: ConfigSortOrder | null;
  switch (order.field.type) {
    case "info":
      configSortOrder = createConfigSortOrderInfo(order, metadata);
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

function createConfigSortOrderInfo(
  configStatic: ConfigStaticSortOrder,
  metadata: VcfMetadataContainer,
): ConfigSortOrder | null {
  const configField: ConfigStaticFieldInfo = configStatic.field as ConfigStaticFieldInfo;
  const field = getInfoField(metadata, configField.name);
  return field !== undefined ? { direction: configStatic.direction, field: field } : null;
}
