import { FieldMetadata } from "./MetadataParser";
import { parseValue } from "./DataParser";
import { parseIntegerValue, Value } from "./ValueParser";

export interface RecordSample {
  [index: string]: RecordSampleType;
}

export type RecordSampleType = Genotype | Value | Value[];
export type GenotypeAllele = number | null;
export type GenotypeType = "het" | "hom_a" | "hom_r" | "miss" | "part";

export interface Genotype {
  a: GenotypeAllele[];
  p?: boolean;
  t: GenotypeType;
}

export interface FormatMetadataContainer {
  [key: string]: FieldMetadata;
}

export function parseRecordSample(
  token: string,
  formatFields: string[],
  formatMetadataContainer: FormatMetadataContainer
): RecordSample {
  const parts = token.split(":");

  const recordSample: RecordSample = {};
  for (let i = 0; i < parts.length; ++i) {
    const field = formatFields[i];
    recordSample[field] = parseFormatValue(parts[i], formatMetadataContainer[field]);
  }
  return recordSample;
}

export function parseFormatValue(token: string, formatMetadata: FieldMetadata): RecordSampleType {
  let value: Genotype | Value | Value[];
  if (formatMetadata.id === "GT") {
    value = parseGenotype(token);
  } else {
    value = parseValue(token, formatMetadata);
  }
  return value;
}

export function parseGenotype(token: string): Genotype {
  const alleles = token.split(/[|/]/).map((index) => parseIntegerValue(index));

  const genotype: Genotype = {
    a: alleles,
    t: determineGenotypeType(alleles),
  };
  if (alleles.length > 1) {
    genotype.p = token.indexOf("|") !== -1;
  }
  return genotype;
}

export function determineGenotypeType(alleles: GenotypeAllele[]): GenotypeType {
  let type: GenotypeType;
  if (alleles.every((allele) => allele === null)) {
    type = "miss";
  } else if (alleles.some((allele) => allele === null)) {
    type = "part";
  } else if (alleles.every((allele) => allele === 0)) {
    type = "hom_r";
  } else if (alleles.every((allele) => allele === alleles[0])) {
    type = "hom_a";
  } else {
    type = "het";
  }
  return type;
}
