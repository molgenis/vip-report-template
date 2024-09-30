export type VariantTypeId = "snv" | "str" | "sv";
export type VariantType = {
  id: VariantTypeId;
  label: string;
  description: string;
};

const variantTypeMap: { [key: string]: VariantType } = {
  snv: { id: "snv", label: "SNV", description: "Single nucleotide variants and Indels < 50 bases" },
  str: { id: "str", label: "STR", description: "Short tandem repeats" },
  sv: { id: "sv", label: "SV/CNV", description: "Structural variants including copy number variants" },
};

export function getVariantTypes(): VariantType[] {
  return Object.values(variantTypeMap);
}

export function mapVariantTypeIdToVariantType(variantTypeId: string): VariantType {
  const variantType = variantTypeMap[variantTypeId];
  if (variantType === undefined) {
    throw new Error(`unknown variant type '${variantTypeId}'`);
  }
  return variantType;
}
