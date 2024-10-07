import { SampleContainer } from "../utils/sample";
import { FieldMetadata, InfoMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { ConfigFieldCustom } from "./configFieldCustom";

export type FieldId = string;
export type FieldType = "custom" | "format" | "info";
export type FieldIndex = number;

interface ConfigFieldBase {
  type: FieldType;
  parentFieldValueIndex?: FieldIndex; // workaround, because index is not readily available through API
}

interface ConfigFieldCustomBase extends ConfigFieldBase {
  type: "custom";
  id: FieldId;
  label: string;
}

export interface ConfigFieldFormat extends ConfigFieldBase {
  type: "format";
  field: FieldMetadata;
  sample: SampleContainer;
}

export interface ConfigFieldInfo extends ConfigFieldBase {
  type: "info";
  field: InfoMetadata;
}

export type ConfigFieldItem = ConfigFieldCustom | ConfigFieldFormat | ConfigFieldInfo;

export interface ConfigFieldGroup {
  type: "group";
  fieldConfigs: ConfigFieldItem[];
}

export type ConfigField = ConfigFieldItem | ConfigFieldGroup;

// note: add custom field to configFieldCustom.d.ts
