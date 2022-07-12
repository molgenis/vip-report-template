import { Record } from "@molgenis/vip-report-vcf/src/Vcf";

export function arrayEquals<T>(a: T[], b: T[]) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

export function getRecordKey(record: Record) {
  return `${record.c}_${record.p}_${record.r}_${record.a.join("&")}`;
}
