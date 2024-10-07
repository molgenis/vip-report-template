import { ConfigFilter } from "./configFilter";
import { ConfigField } from "./configField";

export type ConfigFilters = ConfigFilter[];
export type ConfigFields = ConfigField[];

export type Config = {
  fields: ConfigFields;
  filters: ConfigFilters;
};

export type ConfigStaticFieldType = "custom" | "format" | "info";
export type ConfigStaticFieldName = string;
export type ConfigStaticFieldItem = { type: ConfigStaticFieldType; name: ConfigStaticFieldName };
export type ConfigStaticFieldItemGroup = { type: "group"; fields: ConfigStaticFieldItem[] };
export type ConfigStaticField = ConfigStaticFieldItem | ConfigStaticFieldItemGroup;

export type ConfigStaticVariantType = "str" | "snv" | "sv";
export type ConfigStaticVariantTypeFields = {
  variantType: { [key in ConfigStaticVariantType]: ConfigStaticField[] };
  default: ConfigStaticField[];
};

export type ConfigStatic = {
  fields: ConfigStaticVariantTypeFields;
  filters: ConfigStaticVariantTypeFields;
};
