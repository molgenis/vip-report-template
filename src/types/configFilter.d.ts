import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";

import { ConfigFilterComposed, FilterValueComposed } from "./configFilterComposed";
import { SampleContainer } from "../Api.ts";

export type FilterId = string;
export type FilterType = "composed" | "genotype" | "info";
export type FilterCategoryId = string;
export type FilterCategory = {
  id: FilterCategoryId;
  label: string;
  count?: number;
};
export type FilterValueCategorical = FilterCategoryId[];
export type FilterValueString = string[];
export type ValueNumber = number | undefined;
export type FilterValueFlag = FilterValueCategorical;
export type FilterValueInterval = { left: ValueNumber; right: ValueNumber };
export type FilterValueField = FilterValueCategorical | FilterValueString | FilterValueInterval;
export type FilterValue = FilterValueField | FilterValueComposed;
export type FilterValueMap = { [key: FilterId]: FilterValue };

export type ConfigFilter = ConfigFilterComposed | ConfigFilterField | ConfigFilterFormat;

export interface ConfigFilterBase {
  type: FilterType;
  id: FilterId;
  label: () => string;
  description: () => string | null;
}

export interface ConfigFilterField extends ConfigFilterBase {
  field: FieldMetadata;
}

export interface ConfigFilterFormat extends ConfigFilterField {
  sample: SampleContainer;
}

// note: add composed filters to configFilterComposed.d.ts
