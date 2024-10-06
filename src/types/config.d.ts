import { ConfigFilter } from "./filter";
import { ConfigField } from "./field";

export type ConfigFilters = ConfigFilter[];
export type ConfigFields = ConfigField[];

export type Config = {
  fields: ConfigFields;
  filters: ConfigFilters;
};
