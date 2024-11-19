import { VariantType } from "../variantType.ts";
import {
  Config,
  ConfigJson,
  ConfigJsonSorts,
  ConfigJsonVariants,
  ConfigJsonVariantTypeFields,
  ConfigJsonVariantTypeFilters,
  ConfigVariants,
  ConfigVip,
  Describable,
} from "../../types/config";
import { initConfigFilters } from "./configFilters.ts";
import { MetadataContainer, SampleContainer } from "../api.ts";
import { initConfigSorts } from "./configSorts.ts";
import { initConfigCells } from "./configCells.ts";
import { ConfigInvalidError, ConfigInvalidMissingPropertyError } from "../error.ts";
import { initConfigVip } from "./configVip.ts";

export function initConfig(
  config: ConfigJson,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): Config {
  const configVip = initConfigVip(config.vip, metadata);

  let configStaticVariants;
  if (sample !== null) {
    configStaticVariants = config.sample_variants;
    if (configStaticVariants === undefined) throw new ConfigInvalidMissingPropertyError("sample_variants"); // FIXME remove after resolving FIXME in configValidator.ts
  } else {
    configStaticVariants = config.variants;
    if (configStaticVariants === undefined) throw new ConfigInvalidMissingPropertyError("variants"); // FIXME remove after resolving FIXME in configValidator.ts
  }

  const configVariants = initConfigVariants(configStaticVariants, configVip, variantType, metadata, sample);

  return { vip: configVip, variants: configVariants };
}

function initConfigVariants(
  config: ConfigJsonVariants,
  configVip: ConfigVip,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigVariants {
  const cells = initConfigVariantsCells(config.cells, variantType, metadata, sample);
  const filters = initConfigVariantsFilters(config.filters, configVip, variantType, metadata, sample);
  const sorts = initConfigVariantsSorts(config.sorts, variantType, metadata);
  return {
    cells,
    filters,
    sorts,
  };
}

function initConfigVariantsCells(
  config: ConfigJsonVariantTypeFields,
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
  config: ConfigJsonVariantTypeFilters | undefined,
  configVip: ConfigVip,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
) {
  const configValue = config && (config[variantType.id] || config["all"]);
  return configValue ? initConfigFilters(configValue, configVip, metadata, sample) : [];
}

function initConfigVariantsSorts(
  config: ConfigJsonSorts | undefined,
  variantType: VariantType,
  metadata: MetadataContainer,
) {
  const configValue = config && (config[variantType.id] || config["all"]);
  return configValue ? initConfigSorts(configValue, metadata) : [];
}

export function getLabel(config: Describable, defaultLabel: string): string {
  return config.label !== undefined ? config.label : defaultLabel;
}

export function getDescription(config: Describable, defaultDescription?: string): string | null {
  return config.description !== undefined
    ? config.description
    : defaultDescription !== undefined
      ? defaultDescription
      : null;
}
