import { ConfigJsonFieldGenotype, ConfigJsonFieldInfo, ConfigJsonFilterInfo } from "../../types/config";
import { ConfigFilterField, ConfigFilterFormat } from "../../types/configFilter";
import { SampleContainer, VcfMetadataContainer } from "../api.ts";
import { FieldMetadataWrapper, getInfoFieldsRegex, getSampleFieldsRegex } from "../vcf.ts";
import { getDescription, getLabel } from "./config.ts";

function createConfigFilterGenotype(
  config: ConfigJsonFieldGenotype,
  field: FieldMetadataWrapper,
  sample: SampleContainer,
): ConfigFilterFormat {
  return {
    type: "genotype",
    id: config.name,
    label: () => getLabel(config, field.label || field.id),
    description: () => getDescription(config, field.description),
    field,
    sample,
  };
}

export function initConfigFiltersGenotype(
  config: ConfigJsonFieldGenotype,
  metadata: VcfMetadataContainer,
  sample: SampleContainer,
): ConfigFilterFormat[] {
  return getSampleFieldsRegex(metadata, new RegExp(`^${config.name}$`))
    .filter((field) => !field.nested)
    .map((field) => createConfigFilterGenotype(config, field, sample));
}

function createConfigFilterInfo(config: ConfigJsonFilterInfo, field: FieldMetadataWrapper): ConfigFilterField {
  return {
    defaultValue: config.defaultValue,
    type: "info",
    id: field.id,
    label: () => getLabel(config, field.label || field.id),
    description: () => getDescription(config, field.description),
    field,
  };
}

export function initConfigFiltersInfo(
  config: ConfigJsonFieldInfo,
  metadata: VcfMetadataContainer,
): ConfigFilterField[] {
  return getInfoFieldsRegex(metadata, new RegExp(`^${config.name}$`))
    .filter((field) => !field.nested)
    .map((field) => createConfigFilterInfo(config, field));
}
