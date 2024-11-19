import { ConfigJsonFieldInfo, ConfigJsonSort, ConfigJsonSortOrder } from "../../types/config";
import { UnexpectedEnumValueException } from "../error.ts";
import { ConfigSort, ConfigSortOrder, ConfigSorts } from "../../types/configSort";
import { MetadataContainer, VcfMetadataContainer } from "../api.ts";
import { getInfoField } from "../vcf.ts";

export function initConfigSorts(configs: ConfigJsonSort[], metadata: MetadataContainer): ConfigSorts {
  return configs
    .flatMap((configStaticSort) => createConfigSort(configStaticSort, metadata.records))
    .filter((configSort) => configSort !== null);
}

function createConfigSortOrders(config: ConfigJsonSort, metadata: VcfMetadataContainer): ConfigSortOrder[] {
  const configSortOrders = config.orders.map((order) => createConfigSortOrder(order, metadata));
  return configSortOrders.filter((configSortOrder) => configSortOrder !== null);
}

function createConfigSort(config: ConfigJsonSort, metadata: VcfMetadataContainer): ConfigSort | null {
  const orders = createConfigSortOrders(config, metadata);
  return orders.length !== 0 ? { selected: config.selected, orders } : null;
}

function createConfigSortOrder(order: ConfigJsonSortOrder, metadata: VcfMetadataContainer) {
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
  configStatic: ConfigJsonSortOrder,
  metadata: VcfMetadataContainer,
): ConfigSortOrder | null {
  const configField: ConfigJsonFieldInfo = configStatic.field as ConfigJsonFieldInfo;
  const field = getInfoField(metadata, configField.name);
  return field !== undefined ? { direction: configStatic.direction, field: field } : null;
}
