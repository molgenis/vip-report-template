import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { InvalidIdException } from "./error.ts";

export function getRecordLabel(item: Item<VcfRecord>) {
  const record = item.data;
  const refLabel = getAlleleLabel(record.r);
  return `${record.c}:${record.p} ${record.a.map((a) => `${refLabel}>${getAlleleLabel(a)}`).join(" / ")}`;
}

function getAlleleLabel(allele: string | null) {
  return allele !== null
    ? allele.length > 4
      ? allele.substring(0, 2) + "\u2026" + allele.charAt(allele.length - 1)
      : allele
    : ".";
}

/**
 * Create an absolute url path from a list of components
 */
export function href(urlComponents: (string | number)[]) {
  return "/" + urlComponents.map((urlComponent) => encodeURIComponent(urlComponent)).join("/");
}

/**
 * Parse non-negative integer id
 */
export function parseId(id: string | undefined): number {
  const numberValue = Number(id);
  if (!isPositiveInteger(numberValue)) {
    throw new InvalidIdException(id);
  }
  return numberValue;
}

export function abbreviateHeader(header: string) {
  return header.length > 13 ? header.slice(0, 11) + "\u2026" : header;
}

export function isPositiveInteger(numberValue: number) {
  return !isNaN(numberValue) && Number.isInteger(numberValue) && numberValue >= 0;
}

/**
 * Validates that interval left and/or right values are integers or floats
 *
 * @return validation error message or undefined if interval is valid
 */
export function validateIntervalInput(
  id: string,
  left: string | undefined,
  right: string | undefined,
): string | undefined {
  const leftNum = Number(left);
  const rightNum = Number(right);

  if (left && isNaN(leftNum)) {
    return `Input 'from' (${left}) for filter '${id}' should be a number.`;
  }
  if (right && isNaN(rightNum)) {
    return `Input 'to' (${right}) for filter '${id}' should be a number.`;
  }
  if (left && right && rightNum < leftNum) {
    return `Input 'to' (${right}) for filter '${id}' should have a higher value than the 'from' input (${left}).`;
  }
}
