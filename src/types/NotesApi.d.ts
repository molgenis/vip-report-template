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
  RU_NR: number | undefined;
  RU: string | undefined;
  END: number | undefined;
};

export type Classification = {
  id: string;
  value: string;
  variantKey: VariantKey;
  feature: string;
  reportId: string;
  sampleId: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ClassificationOption = {
  value: string | undefined;
  description: string;
};

export type Status = "pending" | "approved";
