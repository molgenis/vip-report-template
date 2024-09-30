import { ConfigStaticFieldGenotype, ConfigStaticFieldInfo } from "../../types/config";
import { ConfigFilterField, ConfigFilterFormat } from "../../types/configFilter";
import { SampleContainer, VcfMetadataContainer } from "../api.ts";
import { FieldMetadataWrapper, getInfoFieldsRegex, getSampleFieldsRegex } from "../vcf.ts";
import { getDescription, getLabel } from "./config.ts";

function createConfigFilterGenotype(
  configStatic: ConfigStaticFieldGenotype,
  field: FieldMetadataWrapper,
  sample: SampleContainer,
): ConfigFilterFormat {
  return {
    type: "genotype",
    id: configStatic.name,
    label: () => getLabel(configStatic, field.label || field.id),
    description: () => getDescription(configStatic, field.description),
    field,
    sample,
  };
}

export function initConfigFiltersGenotype(
  configStatic: ConfigStaticFieldGenotype,
  metadata: VcfMetadataContainer,
  sample: SampleContainer,
): ConfigFilterFormat[] {
  return getSampleFieldsRegex(metadata, new RegExp(configStatic.name))
    .filter((field) => !field.nested)
    .map((field) => createConfigFilterGenotype(configStatic, field, sample));
}

function createConfigFilterInfo(configStatic: ConfigStaticFieldInfo, field: FieldMetadataWrapper): ConfigFilterField {
  return {
    type: "info",
    id: field.id,
    label: () => getLabel(configStatic, field.label || field.id),
    description: () => getDescription(configStatic, field.description),
    field,
  };
}

export function initConfigFiltersInfo(
  configStatic: ConfigStaticFieldInfo,
  metadata: VcfMetadataContainer,
): ConfigFilterField[] {
  return getInfoFieldsRegex(metadata, new RegExp(configStatic.name))
    .filter((field) => !field.nested)
    .map((field) => createConfigFilterInfo(configStatic, field));
}
