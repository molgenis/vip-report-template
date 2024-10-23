import { ConfigFilter } from "./configFilter";
import { ConfigCell } from "./configCell";

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

export type ConfigStaticVariantType = "str" | "snv" | "sv";
export type ConfigStaticVariantTypeFields = {
  default: ConfigStaticField[];
  variantType?: { [key in ConfigStaticVariantType]: ConfigStaticField[] };
};

export type ConfigStatic = {
  cells: ConfigStaticVariantTypeFields;
  filters: ConfigStaticVariantTypeFields;
};

export type ConfigFilters = ConfigFilter[];
export type ConfigCells = ConfigCell[];

export type Config = {
  cells: ConfigCells;
  filters: ConfigFilters;
};
