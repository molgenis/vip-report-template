import { VariantType } from "./variantTypeUtils";
import {
  ConfigStaticSorts,
  ConfigStaticVariants,
  ConfigStaticVariantTypeFields,
  ConfigStaticVip,
  ConfigVariants,
} from "../types/config";
import { createConfigFilters } from "./configFilters";
import { createConfigFields } from "./configFields";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { createFieldMap, FieldMap } from "./utils.ts";
import { ConfigError } from "./error.ts";
import { createConfigSorts } from "./ConfigSorts.ts";
import { ConfigVip } from "../types/configVip";

export function initConfigVariants(
  config: ConfigStaticVariants,
  metadata: MetadataContainer,
  variantType: VariantType,
  sample: SampleContainer | null,
): ConfigVariants {
  const fieldMap = createFieldMap(metadata.records);

  return {
    cells: createConfigCellsVariantType(config.cells, variantType, sample, fieldMap),
    filters: createConfigFiltersVariantType(config.filters, variantType, metadata, sample, fieldMap),
    sort: createConfigSortVariantType(config.sort, variantType, fieldMap),
  };
}

export function initVipConfig(config: ConfigStaticVip, metadata: MetadataContainer): ConfigVip {
  const fieldMap = createFieldMap(metadata.records);
  const id = config.filter.field.name;
  const fieldMeta = fieldMap[`FORMAT/${id}`];
  if (fieldMeta === undefined) {
    return {};
  }
  if (fieldMeta.type !== "CATEGORICAL") {
    throw new Error("VIP filter field should be of type 'CATEGORICAL'");
  }
  console.log(fieldMap);
  return {
    filter: {
      field: fieldMeta,
      args: config.filter.args,
    },
  };
}

function createConfigSortVariantType(config: ConfigStaticSorts, variantType: VariantType, fieldMap: FieldMap) {
  if (config === undefined) {
    return [];
  }
  const configStaticFields = config[variantType.id] || config["all"];
  if (configStaticFields === undefined) throw new ConfigError(`missing 'sorts.${variantType.id}'`);
  return createConfigSorts(configStaticFields, fieldMap);
}

function createConfigCellsVariantType(
  config: ConfigStaticVariantTypeFields,
  variantType: VariantType,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
) {
  const configStaticFields = config[variantType.id] || config["all"];
  if (configStaticFields === undefined) throw new ConfigError(`missing 'cells.${variantType.id}'`);
  return createConfigFields(configStaticFields, fieldMap, sample, variantType);
}

function createConfigFiltersVariantType(
  config: ConfigStaticVariantTypeFields,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
) {
  const configStaticFields = config[variantType.id] || config["all"];
  if (configStaticFields === undefined) throw new ConfigError(`missing 'filters.${variantType.id}'`);
  return createConfigFilters(configStaticFields, metadata, sample, fieldMap);
}
