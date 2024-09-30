import { ValueString } from "@molgenis/vip-report-vcf";

export type VariantTypeId = "all" | "snv" | "str" | "sv";
export type VariantType = {
  id: VariantTypeId;
  label: string;
  description: string;
};

const variantTypeMap: { [key: string]: VariantType } = {
  all: { id: "all", label: "All", description: "All variants" },
  snv: { id: "snv", label: "SNV", description: "Single nucleotide variants and Indels < 50 bases" },
  str: { id: "str", label: "STR", description: "Short tandem repeats" },
  sv: { id: "sv", label: "SV/CNV", description: "Structural variants including copy number variants" },
};

export function getVariantTypes(variantTypeIds: Set<VariantTypeId>): VariantType[] {
  return Object.values(variantTypeMap).filter((variantType) => variantTypeIds.has(variantType.id));
}

export function parseVariantType(variantTypeId: string | undefined): VariantType {
  if (variantTypeId === undefined) {
    throw new Error();
  }

  const variantType = variantTypeMap[variantTypeId];
  if (variantType === undefined) {
    throw new Error(`unknown variant type '${variantTypeId}'`);
  }
  return variantType;
}

export function mapSvTypeToVariantTypeId(svType: ValueString | undefined): VariantTypeId {
  let variantType: VariantTypeId;
  if (svType === undefined || svType === null) {
    variantType = "snv";
  } else if (svType === "STR") {
    variantType = "str";
  } else {
    variantType = "sv";
  }
  return variantType;
}
