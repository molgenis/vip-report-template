import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";

export function getSpecificConsequence(csqs: ValueArray, rowIndex: number): ValueArray {
  if (rowIndex < 0) {
    throw new Error("Consequences index must be 0 or higher.");
  }
  return csqs.length >= rowIndex ? (csqs[rowIndex] as ValueArray) : [];
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
