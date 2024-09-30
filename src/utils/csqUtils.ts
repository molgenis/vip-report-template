import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";

function is(infoMeta: FieldMetadata, id: string) {
  return infoMeta.id === id;
}

function isCsq(infoMeta: FieldMetadata) {
  return infoMeta.parent?.id === "CSQ";
}

export function isCsqInfo(infoMeta: FieldMetadata, id: string) {
  return isCsq(infoMeta) && is(infoMeta, id);
}

export function isAnyCsqInfo(infoMeta: FieldMetadata, ids: string[]) {
  return isCsq(infoMeta) && ids.some((id) => is(infoMeta, id));
}

export function getNestedFieldIndices(fieldMetadata: FieldMetadata, ids: string[]): number[] {
  return ids.map((id) => getNestedFieldIndex(fieldMetadata, id));
}

export function getNestedFieldIndex(fieldMetadata: FieldMetadata, id: string): number {
  if (fieldMetadata.nested === undefined) throw new Error(`field '${fieldMetadata.id}' is not nested`);
  return fieldMetadata.nested.items.findIndex((childFieldMetadata) => childFieldMetadata.id === id) || -1;
}

export function getFieldMultilineValue(
  fieldMetadata: FieldMetadata,
  record: Item<Record>,
  valueIndex: number,
  fieldIndex: number,
): Value | undefined {
  const csqValue = getNestedFieldValues(fieldMetadata, record)[valueIndex] as Value[];
  return csqValue[fieldIndex];
}

export function getFieldValueCount(fieldMetadata: FieldMetadata | undefined, record: Item<Record>) {
  return fieldMetadata ? getNestedFieldValues(fieldMetadata, record).length : 0;
}

function getNestedFieldValues(csqFieldMetadata: FieldMetadata, record: Item<Record>): ValueArray {
  return record.data.n[csqFieldMetadata.id] as ValueArray;
}
