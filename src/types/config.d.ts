import { ConfigFilter } from "./configFilter";
import { ConfigCell } from "./configCells";
import { ConfigSort } from "./configSort";
import { FieldMetadataWrapper } from "../utils/vcf.ts";

export interface Describable {
  // overwrites existing label
  label?: string;
  // overwrites existing description
  description?: string;
}

export interface ConfigJsonFieldFixed extends Describable {
  type: "fixed";
  name: "chrom" | "pos" | "id" | "ref" | "alt" | "qual" | "filter";
}

export interface ConfigJsonFieldInfo extends Describable {
  type: "info";
  name: string;
}

export interface ConfigJsonFieldFormat extends Describable {
  type: "format";
  name: string;
}

export interface ConfigJsonFieldGenotype extends Describable {
  type: "genotype";
  name: string;
}

export interface ConfigJsonFieldComposed extends Describable {
  type: "composed";
  name:
    | "clinVar"
    | "gene"
    | "genotype"
    | "genotype_maternal"
    | "genotype_paternal"
    | "gnomAdAf"
    | "hpo"
    | "inheritancePattern"
    | "locus"
    | "ref"
    | "vipC"
    | "vipCS"
    | "vkgl";
}

export interface ConfigJsonSort {
  selected: boolean;
  orders: ConfigJsonSortOrder[];
}

export interface ConfigJsonSortOrder {
  direction: "desc" | "asc";
  field: ConfigJsonFieldItem;
}

export interface ConfigJsonRecordsPerPageOption {
  selected?: boolean;
  number: number;
}

export type ConfigJsonFieldItem =
  | ConfigJsonFieldFixed
  | ConfigJsonFieldInfo
  | ConfigJsonFieldFormat
  | ConfigJsonFieldGenotype
  | ConfigJsonFieldComposed;

export type ConfigJsonFieldItemGroup = { type: "group"; fields: ConfigJsonFieldItem[] };
export type ConfigJsonField = ConfigJsonFieldItem | ConfigJsonFieldItemGroup;

export interface ConfigJsonFilterFixed extends Describable {
  type: "fixed";
  name: "chrom" | "pos" | "id" | "ref" | "alt" | "qual" | "filter";
}

export interface ConfigJsonFilterInfo extends Describable {
  type: "info";
  name: string;
}

export interface ConfigJsonFilterFormat extends Describable {
  type: "format";
  name: string;
}

export interface ConfigJsonFilterGenotype extends Describable {
  type: "genotype";
  name: string;
}

export interface ConfigJsonFilterComposed extends Describable {
  type: "composed";
  name: "allelicImbalance" | "deNovo" | "hpo" | "inheritanceMatch" | "locus" | "vipC" | "vipCS";
}

export type ConfigJsonFilter =
  | ConfigJsonFilterFixed
  | ConfigJsonFilterInfo
  | ConfigJsonFilterFormat
  | ConfigJsonFilterGenotype
  | ConfigJsonFilterComposed;

export type ConfigJsonVariantType = "all" | "str" | "snv" | "sv";
export type ConfigJsonVariantTypeFields = { [key in ConfigJsonVariantType]?: ConfigJsonField[] };
export type ConfigJsonVariantTypeFilters = { [key in ConfigJsonVariantType]?: ConfigJsonFilter[] };
export type ConfigJsonSorts = { [key in ConfigJsonVariantType]?: ConfigJsonSort[] };
export type ConfigJsonRecordsPerPage = { [key in ConfigJsonVariantType]?: ConfigJsonRecordsPerPageOption[] };

export type ConfigJsonVipParamsCram = { call_snv: boolean; call_str: boolean; call_sv: boolean; call_cnv: boolean };

export type ConfigJsonVipParamsVcf = {
  filter: { classes: string; consequences: boolean };
  filter_samples: { classes: string };
};

export type ConfigJsonVipParams = {
  cram?: ConfigJsonVipParamsCram;
  vcf: ConfigJsonVipParamsVcf;
};

export type ConfigJsonVip = {
  filter_field: ConfigJsonFieldGenotype;
  params: ConfigJsonVipParams;
};

export type ConfigJsonVariants = {
  cells: ConfigJsonVariantTypeFields;
  filters?: ConfigJsonVariantTypeFilters;
  sorts?: ConfigJsonSorts;
  recordsPerPage?: ConfigJsonRecordsPerPage;
};

export type ConfigJsonVariant = {
  cells: ConfigJsonVariantTypeFields;
  sample_cells?: ConfigJsonVariantTypeFields;
};

export type ConfigJsonVariantConsequence = {
  sample_cells?: ConfigJsonVariantTypeFields;
};

export type ConfigJson = {
  vip: ConfigJsonVip;
  sample_variants: ConfigJsonVariants;
  variants: ConfigJsonVariants;
  sample_variant: ConfigJsonVariant;
  variant: ConfigJsonVariant;
  sample_variant_consequence: ConfigJsonVariantConsequence;
  variant_consequence: ConfigJsonVariantConsequence;
};

export type Config = {
  vip: ConfigVip;
  variants: ConfigVariants;
  variant: ConfigVariant;
  variantConsequence: ConfigVariantConsequence;
};

export type ConfigFilters = ConfigFilter[];
export type ConfigCells = ConfigCell[];
export type ConfigSorts = ConfigSort[];
export type ConfigRecordsPerPageOption = ConfigJsonRecordsPerPageOption;
export type ConfigRecordsPerPage = ConfigRecordsPerPageOption[];

export type ConfigVariants = {
  cells: ConfigCells;
  filters: ConfigFilters;
  sorts: ConfigSorts;
  recordsPerPage: ConfigRecordsPerPage;
};

export type ConfigSamplesCells = { [key: string]: ConfigCells };
export type ConfigVariant = {
  cells: ConfigCells;
  samplesCells?: ConfigSamplesCells;
};
export type ConfigVariantConsequence = {
  samplesCells?: ConfigSamplesCells;
};
export type ConfigVipParams = ConfigJsonVipParams;

export type ConfigVip = {
  filter_field: FieldMetadataWrapper | null;
  params: ConfigVipParams;
};
