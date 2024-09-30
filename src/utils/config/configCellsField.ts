import { ConfigStaticFieldGenotype, ConfigStaticFieldInfo } from "../../types/config";
import { CellValueGenotype, CellValueInfo, ConfigCellGenotype, ConfigCellInfo } from "../../types/configCells";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import {
  FieldMetadataWrapper,
  getInfoFieldsRegex,
  getInfoValue,
  getInfoValueCount,
  getSampleFieldsRegex,
  getSampleValue,
  getSampleValueCount,
} from "../vcf.ts";
import { Item } from "@molgenis/vip-report-api";
import { SampleContainer, VcfMetadataContainer } from "../api.ts";
import { getDescription, getLabel } from "./config.ts";

export function initConfigCellInfo(
  configStatic: ConfigStaticFieldInfo,
  metadata: VcfMetadataContainer,
): ConfigCellInfo[] {
  return getInfoFieldsRegex(metadata, new RegExp(configStatic.name))
    .filter((field) => !field.nested)
    .map((field) => createConfigFieldInfo(configStatic, field));
}

function createConfigFieldInfo(configStatic: ConfigStaticFieldInfo, field: FieldMetadataWrapper): ConfigCellInfo {
  return {
    type: "info",
    field,
    label: () => getLabel(configStatic, field.label || field.id),
    description: () => getDescription(configStatic, field.description),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, field),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueInfo => getInfoValue(record, valueIndex, field),
  };
}

export function initConfigCellGenotype(
  configStatic: ConfigStaticFieldGenotype,
  metadata: VcfMetadataContainer,
  sample: SampleContainer,
): ConfigCellGenotype[] {
  return getSampleFieldsRegex(metadata, new RegExp(configStatic.name))
    .filter((field) => !field.nested)
    .map((field) => createConfigFieldGenotype(configStatic, field, sample));
}

function createConfigFieldGenotype(
  configStatic: ConfigStaticFieldGenotype,
  field: FieldMetadataWrapper,
  sample: SampleContainer,
): ConfigCellGenotype {
  return {
    type: "genotype",
    field,
    label: () => getLabel(configStatic, field.label || field.id),
    description: () => getDescription(configStatic, field.description),
    valueCount: (record: Item<VcfRecord>) => getSampleValueCount(sample, record, field),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueGenotype =>
      getSampleValue(sample, record, valueIndex, field),
  };
}
