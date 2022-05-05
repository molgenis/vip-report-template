import { Value, ValueObject, ValueString } from "../api/vcf/ValueParser";
import { Record } from "../api/vcf/Vcf";
import { Sample } from "../api/Api";

export function getCsqHeaderIndex(
  csqHeaders: {
    id: string;
    type: string;
    description: string;
    categories: ValueString[];
    number: ValueObject;
    parent: ValueObject;
    required: boolean;
  }[]
) {
  return csqHeaders.findIndex((csq) => csq.id === "Consequence");
}

export function getSpecificConsequence(csq: Value[][][], rowIndex: number) {
  return csq.length >= rowIndex ? csq[rowIndex] : [];
}

export function getConsequenceLabel(csq: Value[][][], rowIndex: number, csqIndex: number) {
  return csq.length >= rowIndex ? getSpecificConsequence(csq, rowIndex)[csqIndex].join("&") : "#";
}

export function getRecordSamples(record: Record, sample: Sample, pedigreeSamples: Sample[]) {
  return [record.s[sample.index], ...pedigreeSamples.map((pedigreeSample) => record.s[pedigreeSample.index])];
}
