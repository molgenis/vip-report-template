import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { Json } from "@molgenis/vip-report-api";

export type ConfigVip = {
  field?: FieldMetadata;
  params: Json;
};
