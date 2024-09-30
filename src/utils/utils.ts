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

export function validateInterval(id: string, left: string | undefined, right: string | undefined) {
  if (!isValidIntegerValue(left)) {
    return `Input 'from' (${left}) for filter '${id}' should be a positive number.`;
  }
  if (!isValidIntegerValue(right)) {
    return `Input 'to' (${right}) for filter '${id}' should be a positive number.`;
  }

  if (left != undefined && left.length !== 0 && right != undefined && right.length !== 0) {
    if (Number(right) <= Number(left)) {
      return `Input 'to' (${right}) for filter '${id}' should have a higher value than the 'from' input (${left}).`;
    }
  }
}

function isValidIntegerValue(value: string | undefined) {
  if (value !== undefined && value.length !== 0) {
    const numberValue = Number(value);
    if (!isPositiveInteger(numberValue)) return false;
  }
  return true;
}
