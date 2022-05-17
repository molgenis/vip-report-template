import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export function getCsqHeaderIndex(csqMetadataArray: FieldMetadata[]) {
  return csqMetadataArray.findIndex((csqMetadata) => csqMetadata.id === "Consequence");
}

export function getSpecificConsequence(csqs: ValueArray, rowIndex: number) {
  const csq: Value = csqs.length >= rowIndex ? csqs[rowIndex] : ([] as ValueArray);
  return csq;
}

export function getConsequenceLabel(csq: ValueArray, rowIndex: number, csqIndex: number) {
  const csqValues: ValueArray = getSpecificConsequence(csq, rowIndex) as ValueArray;
  const csqValue: Value = csqValues[csqIndex];
  return csqValue;
}

export function getRecordSamples(record: Record, sample: Sample, pedigreeSamples: Sample[]) {
  return [record.s[sample.index], ...pedigreeSamples.map((pedigreeSample) => record.s[pedigreeSample.index])];
}
