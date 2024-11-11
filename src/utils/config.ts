import { VariantType } from "./variantTypeUtils";
import {
  ConfigStaticSorts,
  ConfigStaticVariants,
  ConfigStaticVariantTypeFields,
  ConfigStaticVip,
  ConfigVariants,
} from "../types/config";
import { initConfigFilters } from "./configFilters";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { initConfigSorts } from "./configSorts.ts";
import { ConfigVip } from "../types/configVip";
import { initConfigCells } from "./configCells.ts";

export function initConfigVariants(
  config: ConfigStaticVariants,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigVariants {
  const cells = initConfigVariantsCells(config.cells, variantType, metadata, sample);
  const filters = initConfigVariantsFilters(config.filters, variantType, metadata, sample);
  const sorts = initConfigVariantsSorts(config.sorts, variantType, metadata);
  return {
    cells,
    filters,
    sorts,
  };
}

function initConfigVariantsCells(
  config: ConfigStaticVariantTypeFields,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
) {
  const configValue = config[variantType.id] || config["all"];
  if (configValue === undefined) throw new ConfigInvalidError(`missing required property 'cells.${variantType.id}'`);
  if (configValue.length === 0)
    throw new ConfigInvalidError(`property 'cells.${variantType.id}' requires at least one value`);
  return initConfigCells(configValue, variantType, metadata, sample);
}

function initConfigVariantsFilters(
  config: ConfigStaticVariantTypeFields | undefined,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
) {
  const configValue = config && (config[variantType.id] || config["all"]);
  return configValue ? initConfigFilters(configValue, variantType, metadata, sample) : [];
}

function initConfigVariantsSorts(
  config: ConfigStaticSorts | undefined,
  variantType: VariantType,
  metadata: MetadataContainer,
) {
  const configValue = config && (config[variantType.id] || config["all"]);
  return configValue ? initConfigSorts(configValue, metadata) : [];
}

export function initVipConfig(config: ConfigStaticVip, metadata: MetadataContainer): ConfigVip {
  const fieldMap = metadata.records.fieldMap;
  const id = config.filter.field.name;
  const fieldMeta = fieldMap[`FORMAT/${id}`];
  if (fieldMeta === undefined) {
    return {};
  }
  if (fieldMeta.type !== "CATEGORICAL") {
    throw new Error("VIP filter field should be of type 'CATEGORICAL'");
  }
  return {
    filter: {
      field: fieldMeta,
      args: config.filter.args,
    },
  };
}

export class ConfigInvalidError extends Error {
  constructor(message: string) {
    super(`config invalid: ${message}`);
    this.name = "ConfigInvalidError";
  }
}
