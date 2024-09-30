import { FieldMetadata } from "@molgenis/vip-report-vcf";

export interface ConfigSort {
  selected: boolean | undefined;
  orders: ConfigSortOrder[];
}

export interface ConfigSortOrder {
  direction: "desc" | "asc";
  field: FieldMetadata;
}

export type ConfigSorts = ConfigSort[];
