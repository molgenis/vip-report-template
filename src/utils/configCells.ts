import { ConfigCell, ConfigCellGroup, ConfigCellItem } from "../types/configCell";
import { initConfigCellComposed } from "./configCellsComposed.ts";
import { ConfigCells, ConfigStaticField, ConfigStaticFieldItem, ConfigStaticFieldItemGroup } from "../types/config";
import { VariantType } from "./variantTypeUtils";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { initConfigCellFixed } from "./configCellsFixed.ts";
import { initConfigCellGenotype, initConfigCellInfo } from "./configCellsField.ts";
import { ConfigInvalidError } from "./config.ts";

export function initConfigCells(
  configs: ConfigStaticField[],
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigCells {
  const configCells: (ConfigCell | null)[] = configs.flatMap((configStaticField) => {
    let configCells: (ConfigCell | null)[];
    if (configStaticField.type === "group") {
      configCells = [
        initConfigCellItemGroup(configStaticField as ConfigStaticFieldItemGroup, variantType, metadata, sample),
      ];
    } else {
      configCells = initConfigCellItem(configStaticField as ConfigStaticFieldItem, variantType, metadata, sample);
    }
    return configCells;
  });
  return configCells.filter((configCell) => configCell !== null);
}

function initConfigCellItemGroup(
  config: ConfigStaticFieldItemGroup,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
) {
  const configFields = initConfigCells(config.fields, variantType, metadata, sample) as ConfigCellItem[];

  let fieldConfig: ConfigCellGroup | null;
  if (configFields.length === 0) {
    fieldConfig = null;
  } else {
    fieldConfig = { type: "group", fieldConfigs: configFields };
  }
  return fieldConfig;
}

function initConfigCellItem(
  config: ConfigStaticFieldItem,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigCell[] {
  const type = config.type;

  let configFields: (ConfigCell | null)[];
  switch (type) {
    case "fixed":
      configFields = [initConfigCellFixed(config)];
      break;
    case "info":
      configFields = initConfigCellInfo(config, metadata.records.fieldMap);
      break;
    case "format":
      throw new ConfigInvalidError(`unsupported field type '${type}', did you mean to use 'genotype'?`);
    case "genotype":
      if (sample === null) throw new ConfigInvalidError(`cannot create field, field type '${type}' requires sample`);
      configFields = initConfigCellGenotype(config, metadata.records.fieldMap, sample);
      break;
    case "composed":
      configFields = [initConfigCellComposed(config, metadata.records.fieldMap, sample, variantType)];
      break;
  }
  return configFields.filter((configField) => configField !== null);
}
