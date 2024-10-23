import { ConfigFilter } from "./configFilter";
import { ConfigCell } from "./configCell";

export type ConfigStaticFieldType =
  | "chrom"
  | "pos"
  | "id"
  | "ref"
  | "alt"
  | "qual"
  | "filter"
  | "info"
  | "format"
  | "genotype"
  | "composed";

export interface ConfigStaticFieldTyped {
  type: ConfigStaticFieldType;
  // overwrites existing label
  label?: string;
  // overwrites existing description
  description?: string;
}

export type ConfigStaticFieldName = string;

export interface ConfigStaticFieldNamed extends ConfigStaticFieldTyped {
  name: ConfigStaticFieldName;
}

export interface ConfigStaticFieldChrom extends ConfigStaticFieldTyped {
  type: "chrom";
}

export interface ConfigStaticFieldPos extends ConfigStaticFieldTyped {
  type: "pos";
}

export interface ConfigStaticFieldId extends ConfigStaticFieldTyped {
  type: "id";
}

export interface ConfigStaticFieldRef extends ConfigStaticFieldTyped {
  type: "ref";
}

export interface ConfigStaticFieldAlt extends ConfigStaticFieldTyped {
  type: "alt";
}

export interface ConfigStaticFieldQual extends ConfigStaticFieldTyped {
  type: "qual";
}

export interface ConfigStaticFieldFilter extends ConfigStaticFieldTyped {
  type: "filter";
}

export interface ConfigStaticFieldInfo extends ConfigStaticFieldNamed {
  type: "info";
}

export interface ConfigStaticFieldFormat extends ConfigStaticFieldTyped {
  type: "format";
}

export interface ConfigStaticFieldGenotype extends ConfigStaticFieldNamed {
  type: "genotype";
}

export interface ConfigStaticFieldComposed extends ConfigStaticFieldNamed {
  type: "composed";
}

export type ConfigStaticFieldItem =
  | ConfigStaticFieldChrom
  | ConfigStaticFieldPos
  | ConfigStaticFieldId
  | ConfigStaticFieldRef
  | ConfigStaticFieldAlt
  | ConfigStaticFieldQual
  | ConfigStaticFieldFilter
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
