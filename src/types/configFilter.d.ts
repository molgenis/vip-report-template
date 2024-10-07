import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

import { SampleContainer } from "../utils/sample";
import { ConfigFilterCustom, FilterValueCustom } from "./configFilterCustom";
import { FieldIndex } from "./configField";

export type FilterId = string;
export type FilterType = "custom" | "format" | "info";
export type FilterCategoryId = string;
export type FilterCategory = {
  id: FilterCategoryId;
  label: string;
  count?: number;
};
export type FilterValueCategorical = FilterCategoryId[];
export type FilterValueString = string[];
export type ValueNumber = number | undefined;
export type FilterValueInterval = { left: ValueNumber; right: ValueNumber };
export type FilterValueField = FilterValueCategorical | FilterValueString | FilterValueInterval;
export type FilterValue = FilterValueField | FilterValueCustom;
export type FilterValueMap = { [key: FilterId]: FilterValue };

export type ConfigFilter = ConfigFilterCustom | ConfigFilterField | ConfigFilterFormat;

export interface ConfigFilterBase {
  id: FilterId;
  type: FilterType;
  parentFieldValueIndex?: FieldIndex; // workaround, because index is not readily available through API
}

export interface ConfigFilterField extends ConfigFilterBase {
  field: FieldMetadata;
}

export interface ConfigFilterFormat extends ConfigFilterField {
  sample: SampleContainer;
}

// note: add custom filters to configFilterCustom.d.ts
