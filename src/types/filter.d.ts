import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { SampleContainer } from "../utils/ApiUtils";

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
export type ChromosomeId = string;
export type FilterValueLocus = { chromosome: ChromosomeId; start?: number; end?: number };
export type FilterValue = FilterValueField | FilterValueLocus;
export type FilterValueMap = { [key: FilterId]: FilterValue };

export type FilterConfig = FilterConfigBase | FilterConfigField | FilterConfigFormat;

export interface FilterConfigBase {
  id: FilterId;
  type: FilterType;
}

export type FilterConfigCustom = FilterConfigCustomLocus;

export interface FilterConfigCustomLocus extends FilterConfigBase {
  chromosomes: ChromosomeId[];
}

export interface FilterConfigField extends FilterConfigBase {
  field: FieldMetadata;
}

export interface FilterConfigFormat extends FilterConfigField {
  sample: SampleContainer;
}
