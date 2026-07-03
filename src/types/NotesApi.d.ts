export type Note = {
  id: string;
  content: string;
  variantKey: VariantKey;
  reportId: string;
  sampleId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type VariantKey = {
  Chromosome: string;
  Position: number;
  Reference: string;
  Alternative: string;
  END: number | undefined;
  feature: string;
  hgvsC: string;
  hgvsP: string;
  ru: string | undefined;
  ruNr: number | undefined;
};

export type Classification = {
  id: string;
  value: string;
  variantKey: VariantKey;
  reportId: string;
  sampleId: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ClassificationOption = {
  value: string | undefined;
  label: string;
};

export type Status = "pending" | "approved";
