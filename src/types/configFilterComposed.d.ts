import { ConfigFilterBase, ConfigFilterField, FilterValueCategorical, FilterValueFlag } from "./configFilter";
import { SampleContainer } from "../Api";
import { FieldMetadata } from "../../../vip-report-vcf/src/types/Metadata";

export type ChromosomeId = string;
export type FilterValueHpo = FilterValueCategorical;
export type FilterValueLocus = { chromosome: ChromosomeId; start?: number; end?: number };

export type FilterValueAllelicImbalance = FilterValueFlag;

export type FilterValueInheritanceMatch = FilterValueFlag;

export type ConfigFilterComposed =
  | ConfigFilterHpo
  | ConfigFilterLocus
  | ConfigFilterAllelicImbalance
  | ConfigFilterInheritanceMatch;

export type ConfigFilterHpo = ConfigFilterField;

export interface ConfigFilterAllelicImbalance extends ConfigFilterBase {
  sample: SampleContainer;
  viabField: FieldMetadata;
  genotypeField: FieldMetadata;
}

export interface ConfigFilterInheritanceMatch extends ConfigFilterBase {
  sample: SampleContainer;
  vimField: FieldMetadata;
}

export interface ConfigFilterLocus extends ConfigFilterBase {
  chromosomes: ChromosomeId[];
}

export type FilterValueComposed =
  | FilterValueHpo
  | FilterValueLocus
  | FilterValueAllelicImbalance
  | FilterValueInheritanceMatch;
