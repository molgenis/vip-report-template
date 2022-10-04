import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export function getSpecificConsequence(csqs: ValueArray, rowIndex: number): ValueArray {
  if (rowIndex < 0) {
    throw new Error("Consequences index must be 0 or higher.");
  }
  return csqs.length >= rowIndex ? (csqs[rowIndex] as ValueArray) : [];
}

export function getConsequenceLabel(csq: ValueArray, rowIndex: number, csqMetadataArray: FieldMetadata[]) {
  const csqIndex = csqMetadataArray.findIndex((csqMetadata) => csqMetadata.id === "Consequence");
  const csqValues: ValueArray = getSpecificConsequence(csq, rowIndex);
  const csqValue: Value = csqValues[csqIndex];
  return csqValue;
}

export function getRecordSamples(record: Record, sample: Sample, pedigreeSamples: Sample[]) {
  return [record.s[sample.index], ...pedigreeSamples.map((pedigreeSample) => record.s[pedigreeSample.index])];
}

export function getHeaderValue(key: string, lines: string[]): string | null {
  const token = `##${key}=`;
  for (const line of lines) {
    if (line.startsWith(token)) {
      return line.substring(token.length);
    }
  }
  return null;
}
