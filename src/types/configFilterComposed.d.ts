import {
  ConfigFilterBase,
  ConfigFilterField,
  ConfigFilterFormat,
  FilterValueCategorical,
  FilterValueFlag,
} from "./configFilter";
import { SampleContainer } from "../utils/api.ts";
import { FieldMetadataWrapper } from "../utils/vcf.ts";

export type ChromosomeId = string;
export type FilterValueHpo = FilterValueCategorical;
export type FilterValuePick = FilterValueCategorical;
export type FilterValueLocus = { chromosome: ChromosomeId; start?: number; end?: number };
export type FilterValueVipC = FilterValueCategorical;
export type FilterValueVipCS = FilterValueCategorical;
export type FilterValueAllelicImbalance = FilterValueFlag;
export type FilterValueInheritanceMatch = FilterValueFlag;
export type FilterValueDeNovo = FilterValueFlag;

export type ConfigFilterComposed =
  | ConfigFilterHpo
  | ConfigFilterLocus
  | ConfigFilterAllelicImbalance
  | ConfigFilterInheritanceMatch
  | ConfigFilterDeNovo
  | ConfigFilterPick
  | ConfigFilterVipC
  | ConfigFilterVipCS;

export type ConfigFilterHpo = ConfigFilterField;
export type ConfigFilterPick = ConfigFilterField;

export interface ConfigFilterAllelicImbalance extends ConfigFilterBase {
  sample: SampleContainer;
  viabField: FieldMetadataWrapper;
  genotypeField: FieldMetadataWrapper;
}

export interface ConfigFilterInheritanceMatch extends ConfigFilterBase {
  sample: SampleContainer;
  vimField: FieldMetadataWrapper;
}

export interface ConfigFilterDeNovo extends ConfigFilterBase {
  sample: SampleContainer;
  vidField: FieldMetadataWrapper;
}

export type ConfigFilterVipC = ConfigFilterField;
export type ConfigFilterVipCS = ConfigFilterFormat;

export interface ConfigFilterLocus extends ConfigFilterBase {
  chromosomes: ChromosomeId[];
}

export type FilterValueComposed =
  | FilterValueHpo
  | FilterValueLocus
  | FilterValueAllelicImbalance
  | FilterValueInheritanceMatch
  | FilterValueVipC
  | FilterValueVipCS;
