import { ConfigFilterBase } from "./filter";

export type ChromosomeId = string;
export type FilterValueLocus = { chromosome: ChromosomeId; start?: number; end?: number };

export type ConfigFilterCustom = ConfigFilterCustomLocus;

export interface ConfigFilterCustomLocus extends ConfigFilterBase {
  chromosomes: ChromosomeId[];
}

export type FilterValueCustom = FilterValueLocus;
