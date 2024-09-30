import { ConfigFilterBase } from "./configFilter";

export type ChromosomeId = string;
export type FilterValueLocus = { chromosome: ChromosomeId; start?: number; end?: number };

export type ConfigFilterComposed = ConfigFilterLocus;

export interface ConfigFilterLocus extends ConfigFilterBase {
  chromosomes: ChromosomeId[];
}

export type FilterValueComposed = FilterValueLocus;
