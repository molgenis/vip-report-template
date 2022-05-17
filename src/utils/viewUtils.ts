import { Value, ValueObject, ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Sample } from "@molgenis/vip-report-api/src/Api";

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
