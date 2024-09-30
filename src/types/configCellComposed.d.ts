import { Genotype, InfoMetadata, ValueFlag, ValueFloat, ValueString } from "@molgenis/vip-report-vcf";
import { ValueCategorical } from "../utils/vcf.ts";

export type CellValueClinVar = {
  clnSigs: ValueCategorical[];
  clnIds: number[] | undefined;
  clnRevStats: ValueCategorical[] | undefined;
};

export type CellValueGene = {
  geneIdentifier: ValueString | undefined;
  incompletePenetrance: ValueCategorical | undefined;
  symbol: ValueString;
  symbolSource: ValueString | undefined;
};

export type CellValueGnomAd = {
  c: string;
  p: number;
  r: string;
  a: (string | null)[];
  gnomAdAf: ValueFloat;
  gnomAdCov: ValueFloat | undefined;
  gnomAdQcs: string[] | undefined;
  alleleNum: number | undefined;
};

export type CellValueGenotype = {
  refAllele: string;
  altAlleles: (string | null)[];
  genotype: Genotype;
  svType: ValueString | undefined;
  repeatCount: ValueString | undefined;
  repeatUnitValue: ValueString | undefined;
  repeatUnitMatch: ValueFlag | undefined;
  displayRepeatUnit: ValueString | undefined;
  viab: number | null | undefined;
};

export type CellValueHpo = {
  hpos: ValueCategorical[];
  gadoPd: ValueCategorical | undefined;
};

export type CellValueInheritanceModes = {
  fieldInheritanceModesGene: InfoMetadata;
  inheritanceModesGene: ValueCategorical[];
  isPossibleCompound: ValueFlag | undefined;
};

export type CellValueLocus = { c: string; p: number; href: string };

export type CellValueRef = { ref: string };

export type CellValueVipC = {
  href: string;
  vipC: ValueCategorical;
  vipP: string[] | undefined;
};

export type CellValueVkgl = {
  vkglCl: ValueCategorical;
  vkglAmc: ValueCategorical | undefined;
  vkglErasmus: ValueCategorical | undefined;
  vkglLumc: ValueCategorical | undefined;
  vkglNki: ValueCategorical | undefined;
  vkglRadboudMumc: ValueCategorical | undefined;
  vkglUmcg: ValueCategorical | undefined;
  vkglUmcu: ValueCategorical | undefined;
  vkglVumc: ValueCategorical | undefined;
};

export type CellValueCustom =
  | CellValueClinVar
  | CellValueGene
  | CellValueGnomAd
  | CellValueGenotype
  | CellValueHpo
  | CellValueInheritanceModes
  | CellValueLocus
  | CellValueRef
  | CellValueVipC
  | CellValueVkgl;
