import { FieldMetadata } from "@molgenis/vip-report-vcf";

import { ConfigFilterComposed, FilterValueComposed } from "./configFilterComposed";
import { SampleContainer } from "../Api.ts";

export type FilterId = string;
export type FilterType = "fixed" | "info" | "genotype" | "composed";
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

export type FilterValueChrom = FilterValueString;
export type FilterValuePos = FilterValueInterval;
export type FilterValueId = FilterValueString;
export type FilterValueRef = FilterValueString;
export type FilterValueAlt = FilterValueString;
export type FilterValueQual = FilterValueInterval;
export type FilterValueFilter = FilterValueString;

export type FilterValueFixed =
  | FilterValueChrom
  | FilterValuePos
  | FilterValueId
  | FilterValueRef
  | FilterValueAlt
  | FilterValueQual
  | FilterValueFilter;

export type FilterValueField = FilterValueCategorical | FilterValueString | FilterValueInterval;

export type FilterValue = FilterValueFixed | FilterValueField | FilterValueComposed;
export type FilterValueMap = { [key: FilterId]: FilterValue };

export type ConfigFilterFixed =
  | ConfigFilterChrom
  | ConfigFilterPos
  | ConfigFilterId
  | ConfigFilterRef
  | ConfigFilterAlt
  | ConfigFilterQual
  | ConfigFilterFilter;

export type ConfigFilter =
  | ConfigFilterFixed
  | ConfigFilterComposed
  | ConfigFilterField // TODO rename to ConfigFilterInfo?
  | ConfigFilterFormat; // TODO rename to ConfigFilterGenotype

export interface ConfigFilterBase {
  type: FilterType;
  id: FilterId;
  label: () => string;
  description: () => string | null;
}

export type ConfigFilterChrom = ConfigFilterBase;
export type ConfigFilterPos = ConfigFilterBase;
export type ConfigFilterId = ConfigFilterBase;
export type ConfigFilterRef = ConfigFilterBase;
export type ConfigFilterAlt = ConfigFilterBase;
export type ConfigFilterQual = ConfigFilterBase;
export type ConfigFilterFilter = ConfigFilterBase;

export interface ConfigFilterField extends ConfigFilterBase {
  field: FieldMetadata;
}

export interface ConfigFilterFormat extends ConfigFilterField {
  sample: SampleContainer;
}

// note: add composed filters to configFilterComposed.d.ts
