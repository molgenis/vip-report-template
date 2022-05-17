import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export function getCsqHeaderIndex(csqHeaders: FieldMetadata[]) {
  return csqHeaders.findIndex((csq) => csq.id === "Consequence");
}

export function getSpecificConsequence(csq: ValueArray, rowIndex: number) {
  const value: Value = csq.length >= rowIndex ? csq[rowIndex] : [];
  return value;
}

export function getConsequenceLabel(csq: ValueArray, rowIndex: number, csqIndex: number) {
  const csqValues: ValueArray = getSpecificConsequence(csq, rowIndex) as ValueArray;
  const csqValue: Value = csqValues[csqIndex];
  return csqValue;
}

export function getRecordSamples(record: Record, sample: Sample, pedigreeSamples: Sample[]) {
  return [record.s[sample.index], ...pedigreeSamples.map((pedigreeSample) => record.s[pedigreeSample.index])];
}
