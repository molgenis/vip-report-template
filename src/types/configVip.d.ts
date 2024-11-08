import { FieldMetadata } from "@molgenis/vip-report-vcf";

export type ConfigVipFilter = {
  field: FieldMetadata;
  args: string[];
};

export type ConfigVip = {
  filter?: ConfigVipFilter;
};
