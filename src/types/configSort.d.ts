import { FieldMetadata } from "../../../vip-report-vcf/src/types/Metadata";

export interface ConfigSortOption {
  selected: boolean | undefined;
  orders: ConfigSortOrder[];
}

export interface ConfigSortOrder {
  direction: "desc" | "asc";
  field: FieldMetadata;
}

export type ConfigSorts = ConfigSortOption[];
