import { ConfigFilter } from "./configFilter";
import { ConfigCell } from "./configCells";
import { ConfigSort } from "./configSort";
import { FieldMetadataWrapper } from "../utils/vcf.ts";

export type ConfigStaticFieldType = "fixed" | "info" | "format" | "genotype" | "composed";

export interface ConfigStaticFieldTyped {
  type: ConfigStaticFieldType;
  name: ConfigStaticFieldName;
  // overwrites existing label
  label?: string;
  // overwrites existing description
  description?: string;
}

export type ConfigStaticFieldName = string;

export interface ConfigStaticFieldChrom extends ConfigStaticFieldTyped {
  type: "fixed";
  name: "chrom";
}

export interface ConfigStaticFieldPos extends ConfigStaticFieldTyped {
  type: "fixed";
  name: "pos";
}

export interface ConfigStaticFieldId extends ConfigStaticFieldTyped {
  type: "fixed";
  name: "id";
}

export interface ConfigStaticFieldRef extends ConfigStaticFieldTyped {
  type: "fixed";
  name: "ref";
}

export interface ConfigStaticFieldAlt extends ConfigStaticFieldTyped {
  type: "fixed";
  name: "alt";
}

export interface ConfigStaticFieldQual extends ConfigStaticFieldTyped {
  type: "fixed";
  name: "qual";
}

export interface ConfigStaticFieldFilter extends ConfigStaticFieldTyped {
  type: "fixed";
  name: "filter";
}

export interface ConfigStaticFieldInfo extends ConfigStaticFieldTyped {
  type: "info";
}

export interface ConfigStaticFieldFormat extends ConfigStaticFieldTyped {
  type: "format";
}

export interface ConfigStaticFieldGenotype extends ConfigStaticFieldTyped {
  type: "genotype";
}

export interface ConfigStaticFieldComposed extends ConfigStaticFieldTyped {
  type: "composed";
}

export interface ConfigStaticSort {
  selected: boolean;
  orders: ConfigStaticSortOrder[];
}

export interface ConfigStaticSortOrder {
  direction: "desc" | "asc";
  field: ConfigStaticField;
}

export type ConfigStaticFieldFixed =
  | ConfigStaticFieldChrom
  | ConfigStaticFieldPos
  | ConfigStaticFieldId
  | ConfigStaticFieldRef
  | ConfigStaticFieldAlt
  | ConfigStaticFieldQual
  | ConfigStaticFieldFilter;

export type ConfigStaticFieldItem =
  | ConfigStaticFieldFixed
  | ConfigStaticFieldInfo
  | ConfigStaticFieldFormat
  | ConfigStaticFieldGenotype
  | ConfigStaticFieldComposed;

export type ConfigStaticFieldItemGroup = { type: "group"; fields: ConfigStaticFieldItem[] };
export type ConfigStaticField = ConfigStaticFieldItem | ConfigStaticFieldItemGroup;

export type ConfigStaticVariantType = "all" | "str" | "snv" | "sv";
export type ConfigStaticVariantTypeFields = Partial<Record<ConfigStaticVariantType, ConfigStaticField[]>>;
export type ConfigStaticSorts = Partial<Record<ConfigStaticVariantType, ConfigStaticSort[]>>;

export type ConfigStaticVipParamsCram = { call_snv: boolean; call_str: boolean; call_sv: boolean; call_cnv: boolean };

export type ConfigStaticVipParamsVcf = { filter_samples: { classes: string } };

export type ConfigStaticVipParams = {
  cram?: ConfigStaticVipParamsCram;
  vcf: ConfigStaticVipParamsVcf;
};

export type ConfigStaticVip = {
  filter_field: ConfigStaticFieldGenotype;
  params: ConfigStaticVipParams;
};

export type ConfigStaticVariants = {
  cells: ConfigStaticVariantTypeFields;
  filters?: ConfigStaticVariantTypeFields;
  sorts?: ConfigStaticSorts;
};

export type ConfigStatic = {
  vip: ConfigStaticVip;
  sample_variants: ConfigStaticVariants;
  variants: ConfigStaticVariants;
};

export type Config = {
  vip: ConfigVip;
  variants: ConfigVariants;
};

export type ConfigFilters = ConfigFilter[];
export type ConfigCells = ConfigCell[];
export type ConfigSorts = ConfigSort[];

export type ConfigVariants = {
  cells: ConfigCells;
  filters: ConfigFilters;
  sorts: ConfigSorts;
};

export type ConfigVipParams = ConfigStaticVipParams;

export type ConfigVip = {
  filter_field: FieldMetadataWrapper;
  params: ConfigVipParams;
};
