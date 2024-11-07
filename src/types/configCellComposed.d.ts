import { Genotype, InfoMetadata, ValueDescription, ValueFlag, ValueFloat, ValueString } from "@molgenis/vip-report-vcf";

export type CellValueClinVar = {
  clnIds: number[] | undefined;
  clnRevStats: string[] | undefined;
  clnSigs: ValueDescription[];
};

export type CellValueGene = {
  geneIdentifier: ValueString | undefined;
  incompletePenetrance: ValueFlag | undefined;
  symbol: ValueString;
  symbolSource: ValueString | undefined;
};

export type CellValueGnomAd = {
  c: string;
  p: number;
  r: string;
  a: (string | null)[];
  alleleNum: number;
  gnomAdAf: ValueFloat;
  gnomAdCov: ValueFloat | undefined;
  gnomAdQcs: string[] | undefined;
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
  gadoPd: ValueString | undefined;
  hpos: string[];
};

export type CellValueInheritanceModes = {
  fieldInheritanceModesGene: InfoMetadata;
  inheritanceModesGene: string[];
  isPossibleCompound: boolean;
};

export type CellValueLocus = { c: string; p: number; href: string };

export type CellValueRef = { ref: string };

export type CellValueVipC = {
  href: string;
  vipC: string;
  vipP: string[] | undefined;
};

export type CellValueVkgl = {
  vkglCl: ValueString;
  vkglAmc: ValueString | undefined;
  vkglErasmus: ValueString | undefined;
  vkglLumc: ValueString | undefined;
  vkglNki: ValueString | undefined;
  vkglRadboudMumc: ValueString | undefined;
  vkglUmcg: ValueString | undefined;
  vkglUmcu: ValueString | undefined;
  vkglVumc: ValueString | undefined;
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
