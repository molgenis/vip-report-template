export type Note = {
  id: string;
  content: string;
  variantKey: VariantKey;
  reportId: string;
  sampleId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

export type VariantKey = {
  chromosome: string;
  position: number;
  reference: string;
  alternative: string;
  end: number | undefined;
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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

export type ClassificationOption = {
  value: string | undefined;
  label: string;
};

export type Status = "pending" | "approved";
