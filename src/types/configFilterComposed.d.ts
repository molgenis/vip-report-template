import { ConfigFilterBase, ConfigFilterField, FilterValueCategorical } from "./configFilter";

export type ChromosomeId = string;
export type FilterValueHpo = FilterValueCategorical;
export type FilterValueLocus = { chromosome: ChromosomeId; start?: number; end?: number };

export type ConfigFilterComposed = ConfigFilterHpo | ConfigFilterLocus;

export type ConfigFilterHpo = ConfigFilterField;

export interface ConfigFilterLocus extends ConfigFilterBase {
  chromosomes: ChromosomeId[];
}

export type FilterValueComposed = FilterValueHpo | FilterValueLocus;
