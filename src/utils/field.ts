import {
  FieldMetadata,
  InfoContainer,
  RecordSample,
  Value,
  ValueDescription,
  ValueString,
  VcfRecord,
} from "@molgenis/vip-report-vcf";
import { UnknownVcfFieldError } from "./error.ts";
import { Item } from "@molgenis/vip-report-api";
import { SampleContainer } from "../Api.ts";
import { getRecordSample } from "./utils.ts";

export const isNumerical = (fieldMetadata: FieldMetadata): boolean => {
  return fieldMetadata.type === "FLOAT" || fieldMetadata.type === "INTEGER";
};

export function getCategoryLabelAndDescription(
  infoMetadata: FieldMetadata,
  value: ValueString | undefined,
): ValueDescription {
  if (infoMetadata.categories === undefined) throw new Error();

  let valueDescription: ValueDescription;
  if (value !== null && value !== undefined) {
    const categoryRecord = infoMetadata.categories[value];
    if (categoryRecord === undefined) {
      throw new Error(
        `invalid categorical field '${infoMetadata.id}' value '${value}' is not one of [${Object.keys(infoMetadata.categories).join(", ")}]`,
      );
    }
    valueDescription = categoryRecord;
  } else {
    valueDescription = infoMetadata.nullValue || { label: "" };
  }
  return valueDescription;
}

/**
 * @return {number[]} array of indices where each index >= 0 or index = -1
 */
export function getOptionalNestedFieldIndices(fieldMetadata: FieldMetadata, ids: string[]): number[] {
  return ids.map((id) => getOptionalNestedFieldIndex(fieldMetadata, id));
}

/**
 * @return {number} index >= 0 or index = -1
 */
export function getOptionalNestedFieldIndex(fieldMetadata: FieldMetadata, id: string): number {
  if (fieldMetadata.nested === undefined) throw new Error(`field '${fieldMetadata.id}' is not nested`);
  return fieldMetadata.nested.items.findIndex((childFieldMetadata) => childFieldMetadata.id === id);
}

/**
 * @return {number} index >= 0
 * @throws {UnknownVcfFieldError}
 */
export function getRequiredNestedFieldIndex(fieldMetadata: FieldMetadata, id: string): number {
  const nestedFieldIndex = getOptionalNestedFieldIndex(fieldMetadata, id);
  if (nestedFieldIndex === -1) throw new UnknownVcfFieldError(id, fieldMetadata.id);
  return nestedFieldIndex;
}

export function getInfoMultilineValue(
  fieldMetadata: FieldMetadata,
  record: Item<VcfRecord>,
  valueIndex: number,
  fieldIndex: number,
): Value | undefined {
  const csqValue = getNestedFieldValues(fieldMetadata, record.data.n)[valueIndex] as Value[];
  return csqValue[fieldIndex];
}

type ValueContainer = InfoContainer | RecordSample;

export function getInfoValueCount(fieldMetadata: FieldMetadata | undefined, record: Item<VcfRecord>): number {
  const valueContainer: ValueContainer = record.data.n;
  return getFieldValueCount(fieldMetadata, valueContainer);
}

export function getRecordSampleValueCount(
  fieldMetadata: FieldMetadata | undefined,
  record: Item<VcfRecord>,
  sample: SampleContainer,
): number {
  const valueContainer: ValueContainer = getRecordSample(record, sample);
  return getFieldValueCount(fieldMetadata, valueContainer);
}

function getFieldValueCount(fieldMetadata: FieldMetadata | undefined, valueContainer: ValueContainer): number {
  let count: number;
  if (fieldMetadata === undefined) {
    count = 0;
  } else if (fieldMetadata.number.count === 1) {
    count = 1;
  } else {
    count = getNestedFieldValues(fieldMetadata, valueContainer).length;
  }
  return count;
}

function getNestedFieldValues(fieldMetadata: FieldMetadata, valueContainer: ValueContainer): Value[] {
  const value = valueContainer[fieldMetadata.id];
  return value !== undefined ? (value as Value[]) : [];
}
