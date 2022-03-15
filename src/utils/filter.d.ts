import { FieldMetadata } from "../api/vcf/MetadataParser";

export type FilterValueBoolean = boolean | null;

export type FilterValueCategorical = string[];

export type FilterValueNumber = {
  from: number | null;
  to: number | null;
};

export type FilterValue = FilterValueBoolean | FilterValueCategorical | FilterValueNumber;

export type FilterChangeEvent = {
  fieldMetadata: FieldMetadata;
  value: FilterValue;
};

export type FilterClearEvent = {
  fieldMetadata: FieldMetadata;
};

export type FiltersChangeEvent = {
  filters: FilterChangeEvent[];
};
