import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export function getSpecificConsequence(csqs: ValueArray, rowIndex: number) {
  if (rowIndex < 0) {
    throw new Error("Consequences index must be 0 or higher.");
  }
  const csq: Value = csqs.length >= rowIndex ? csqs[rowIndex] : ([] as ValueArray);
  return csq;
}

export function getConsequenceLabel(csq: ValueArray, rowIndex: number, csqMetadataArray: FieldMetadata[]) {
  const csqIndex = csqMetadataArray.findIndex((csqMetadata) => csqMetadata.id === "Consequence");
  const csqValues: ValueArray = getSpecificConsequence(csq, rowIndex) as ValueArray;
  const csqValue: Value = csqValues[csqIndex];
  return csqValue;
}

export function getRecordSamples(record: Record, sample: Sample, pedigreeSamples: Sample[]) {
  return [record.s[sample.index], ...pedigreeSamples.map((pedigreeSample) => record.s[pedigreeSample.index])];
}

export function getHeaderValue(key: string, lines: string[]) {
  let value = null;
  lines.forEach((line: string) => {
    if (line.startsWith(`##${key}`)) {
      const splitted: string[] = line.split("=");
      if (splitted.length === 2) {
        value = splitted[1];
        return;
      } else {
        throw new Error("Invalid header format for key");
      }
    }
  });
  return value;
}
