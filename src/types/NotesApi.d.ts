//FIXME
export type Note = {
  id: string;
  content: string;
  variantKey: VariantKey;
  reportId: ReportId;
  createdAt: string;
  updatedAt: string;
};
export type VariantKey = {
  Chromosome: string;
  Position: number;
  Reference: string;
  Alternative: string;
  Identifier: string;
};
export type ReportId = string;
export type Classification = {
  id: string;
  value: string;
  variantKey: VariantKey;
  feature: FeatureIdentifier;
  reportId: ReportId;
  status: Status;
  createdAt: string;
  updatedAt: string;
};
export type FeatureIdentifier = string;
export type Status = "pending" | "approved";
