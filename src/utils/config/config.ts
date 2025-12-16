import { VariantType } from "../variantType.ts";
import {
  Config,
  ConfigJson,
  ConfigJsonRecordsPerPage,
  ConfigJsonSorts,
  ConfigJsonVariant,
  ConfigJsonVariantConsequence,
  ConfigJsonVariants,
  ConfigJsonVariantTypeFields,
  ConfigJsonVariantTypeFilters,
  ConfigRecordsPerPage,
  ConfigSamplesCells,
  ConfigVariant,
  ConfigVariantConsequence,
  ConfigVariants,
  ConfigVip,
  Describable,
} from "../../types/config";
import { initConfigFilters } from "./configFilters.ts";
import { composeSample, MetadataContainer, SampleContainer } from "../api.ts";
import { initConfigSorts } from "./configSorts.ts";
import { initConfigCells } from "./configCells.ts";
import { ConfigInvalidError } from "../error.ts";
import { initConfigVip } from "./configVip.ts";

export function initConfig(
  config: ConfigJson,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): Config {
  const configVip = initConfigVip(config.vip, metadata);

  const configStaticVariants: ConfigJsonVariants = sample !== null ? config.sample_variants : config.variants;
  const configVariants = initConfigVariants(configStaticVariants, configVip, variantType, metadata, sample);

  const configStaticVariant: ConfigJsonVariant = sample !== null ? config.sample_variant : config.variant;
  const configVariant = initConfigVariant(configStaticVariant, variantType, metadata, sample);

  const configStaticVariantConsequence: ConfigJsonVariantConsequence =
    sample !== null ? config.sample_variant_consequence : config.variant_consequence;
  const configVariantConsequence = initConfigVariantConsequence(
    configStaticVariantConsequence,
    variantType,
    metadata,
    sample,
  );

  return {
    vip: configVip,
    variants: configVariants,
    variant: configVariant,
    variantConsequence: configVariantConsequence,
  };
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
  const recordsPerPage = initConfigVariantsRecordsPerPage(config.recordsPerPage, variantType);
  return {
    cells,
    filters,
    sorts,
    recordsPerPage,
  };
}

function initConfigVariantsCellsSamples(
  config: ConfigJsonVariantTypeFields,
  sample: SampleContainer,
  variantType: VariantType,
  metadata: MetadataContainer,
): ConfigSamplesCells | undefined {
  const samples: SampleContainer[] = [
    sample,
    ...[sample.paternalSample, sample.maternalSample, ...sample.otherPedigreeSamples]
      .filter((sample) => sample !== null)
      .map((sample) => composeSample(sample)),
  ];

  const cellsSamples: ConfigSamplesCells = {};
  samples.forEach(
    (sample) => (cellsSamples[sample.item.id] = initConfigVariantsCells(config, variantType, metadata, sample)),
  );
  return cellsSamples;
}

function initConfigVariant(
  config: ConfigJsonVariant,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigVariant {
  const cells = initConfigVariantsCells(config.cells, variantType, metadata, sample);
  const cellsSamples =
    sample && config.sample_cells
      ? initConfigVariantsCellsSamples(config.sample_cells, sample, variantType, metadata)
      : undefined;

  return {
    cells,
    samplesCells: cellsSamples,
  };
}

function initConfigVariantConsequence(
  config: ConfigJsonVariantConsequence,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigVariantConsequence {
  const cellsSamples =
    sample && config.sample_cells
      ? initConfigVariantsCellsSamples(config.sample_cells, sample, variantType, metadata)
      : undefined;

  return {
    samplesCells: cellsSamples,
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

function initConfigVariantsRecordsPerPage(
  config: ConfigJsonRecordsPerPage | undefined,
  variantType: VariantType,
): ConfigRecordsPerPage {
  const configValue = config && (config[variantType.id] || config["all"]);
  return configValue || [{ number: 10 }, { number: 20, selected: true }, { number: 50 }, { number: 100 }];
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
