import { SampleContainer } from "../utils/sample";
import { FieldMetadata, InfoMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { ConfigFieldCustom } from "./fieldCustom";

export type FieldId = string;
export type FieldType = "custom" | "format" | "group" | "info";
export type FieldIndex = number;
export type FieldGroupId = string;

interface ConfigFieldBase {
  id: FieldId;
  type: FieldType;
  parentFieldValueIndex?: FieldIndex;
}

interface ConfigFieldCustomBase extends ConfigFieldBase {
  type: "custom";
  label: string;
}

export interface ConfigFieldFormat extends ConfigFieldBase {
  type: "format";
  field: FieldMetadata;
  sample: SampleContainer;
}

export interface ConfigFieldGroup extends ConfigFieldBase {
  type: "group";
  fieldConfigs: ConfigFieldItem[];
}

export interface ConfigFieldInfo extends ConfigFieldBase {
  type: "info";
  field: InfoMetadata;
}

export type ConfigFieldItem = ConfigFieldCustom | ConfigFieldFormat | ConfigFieldInfo;
export type ConfigField = ConfigFieldItem | ConfigFieldGroup;

// note: add custom field to fieldCustom.d.ts
