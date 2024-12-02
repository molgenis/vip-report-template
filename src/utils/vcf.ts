import {
  FieldId,
  FieldMetadata,
  Genotype,
  InfoContainer,
  RecordSample,
  Value,
  ValueDescription,
  ValueString,
  VcfMetadata,
  VcfRecord,
} from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { SampleContainer, VcfMetadataContainer } from "./api.ts";
import { ArrayIndexOutOfBoundsException, InvalidVcfError, RuntimeError } from "./error.ts";

export type ValueCategorical =
  | (ValueDescription & {
      value: ValueString;
    })
  | null;
export type FieldValue = Value | Genotype | ValueCategorical | ValueCategorical[];

export type FieldMetadataWrapper = FieldMetadata & {
  index: number;
};
export type FieldPath = string;
export type FieldMap = { [key: FieldPath]: FieldMetadataWrapper };

export function createFieldMap(metadata: VcfMetadata): FieldMap {
  const infoFields = createFieldMapTypedRec("INFO", Object.values(metadata.info));
  const formatFields = createFieldMapTypedRec("FORMAT", Object.values(metadata.format));
  return { ...infoFields, ...formatFields };
}

function createFieldMapTypedRec(keyPrefix: string, fieldMetadataList: FieldMetadata[]): FieldMap {
  const fields: { [key: string]: FieldMetadataWrapper } = {};
  fieldMetadataList.forEach((fieldMetadata, index) => {
    const key = `${keyPrefix}/${fieldMetadata.id}`;
    if (fieldMetadata.nested) {
      const nestedFields = createFieldMapTypedRec(key, fieldMetadata.nested.items);
      Object.assign(fields, nestedFields);

      // add parent field, but update items with items in nestedFields
      fields[key] = {
        ...fieldMetadata,
        index,
        nested: {
          ...fieldMetadata.nested,
          items: fieldMetadata.nested.items.map((field) => nestedFields[`${key}/${field.id}`]!),
        },
      };
    } else {
      fields[key] = { ...fieldMetadata, index };
    }
  });
  return fields;
}

function mapFieldValueDefined(value: Value | Genotype, fieldMetadata: FieldMetadataWrapper): FieldValue {
  let mappedValue: FieldValue;

  if (fieldMetadata.type === "CATEGORICAL") {
    // map categorical values to categories with label and description
    if (fieldMetadata.number.count === 1) {
      const valueString = value as ValueString;
      mappedValue = createCategoricalValue(fieldMetadata, valueString);
    } else {
      if (!Array.isArray(value)) throw new RuntimeError();
      const valueArray = value as ValueString[];
      if (valueArray.length !== 0) {
        mappedValue = valueArray.map((value) => createCategoricalValue(fieldMetadata, value));
      } else {
        // empty categorical array value should return array with nullValue if it is defined
        mappedValue = fieldMetadata.nullValue ? [{ ...fieldMetadata.nullValue, value: null }] : [];
      }
    }
  } else {
    mappedValue = value;
  }

  return mappedValue;
}

function mapFieldValue(value: Value | Genotype | undefined, fieldMetadata: FieldMetadataWrapper): FieldValue {
  let definedValue: Value | Genotype;
  if (fieldMetadata.number.count === 0) {
    definedValue = value !== undefined ? value : false;
  } else if (fieldMetadata.number.count === 1) {
    definedValue = value !== undefined ? value : null;
  } else {
    definedValue = value !== undefined && value !== null ? value : [];
  }
  return mapFieldValueDefined(definedValue, fieldMetadata);
}

function getFieldValue(
  valueContainer: ValueContainer,
  valueIndex: number,
  fieldMetadata: FieldMetadataWrapper,
): FieldValue {
  let value: Value | Genotype | undefined;
  if (fieldMetadata.parent) {
    if (fieldMetadata.parent.id in valueContainer) {
      const parentValue = valueContainer[fieldMetadata.parent.id]!;
      if (!Array.isArray(parentValue)) throw new InvalidVcfError();
      const parentValueArray = parentValue as Value[];

      if (fieldMetadata.parent.number.count === 1) {
        if (parentValueArray.length < fieldMetadata.index) throw new InvalidVcfError();
        value = parentValueArray[fieldMetadata.index]!;
      } else {
        if (parentValueArray.length < valueIndex) throw new RuntimeError();
        const multiValue = parentValueArray[valueIndex]!;
        if (!Array.isArray(multiValue)) throw new InvalidVcfError();
        const multiValueArray = multiValue as Value[];

        if (multiValueArray.length < fieldMetadata.index) throw new InvalidVcfError();
        value = multiValueArray[fieldMetadata.index]!;
      }
    } else {
      value = undefined;
    }
  } else {
    if (fieldMetadata.id in valueContainer) {
      value = valueContainer[fieldMetadata.id]!;
    } else {
      value = undefined;
    }
  }

  return mapFieldValue(value, fieldMetadata);
}

function getFieldValues(
  valueContainer: ValueContainer,
  valueIndex: number,
  ...fieldMetadataList: (FieldMetadataWrapper | undefined)[]
): (FieldValue | undefined)[] {
  return fieldMetadataList.map(
    (fieldMetadata) => fieldMetadata && getFieldValue(valueContainer, valueIndex, fieldMetadata),
  );
}

export function getInfoValue(
  record: Item<VcfRecord>,
  valueIndex: number,
  fieldMetadata: FieldMetadataWrapper | undefined,
): FieldValue | undefined {
  const valueContainer: ValueContainer = record.data.n;
  return fieldMetadata && getFieldValue(valueContainer, valueIndex, fieldMetadata);
}

export function getInfoValues(
  record: Item<VcfRecord>,
  valueIndex: number,
  ...fieldMetadataList: (FieldMetadataWrapper | undefined)[]
): (FieldValue | undefined)[] {
  const valueContainer: ValueContainer = record.data.n;
  return getFieldValues(valueContainer, valueIndex, ...fieldMetadataList);
}

export function getSampleValue(
  sample: SampleContainer,
  record: Item<VcfRecord>,
  valueIndex: number,
  fieldMetadata: FieldMetadataWrapper | undefined,
): FieldValue | Genotype | undefined {
  const valueContainer: ValueContainer = getRecordSample(sample, record);
  return fieldMetadata && getFieldValue(valueContainer, valueIndex, fieldMetadata);
}

export function getSampleValues(
  sample: SampleContainer,
  record: Item<VcfRecord>,
  valueIndex: number,
  ...fieldMetadataList: (FieldMetadataWrapper | undefined)[]
): (FieldValue | Genotype | undefined)[] {
  const valueContainer: ValueContainer = getRecordSample(sample, record);
  return getFieldValues(valueContainer, valueIndex, ...fieldMetadataList);
}

export const isNumerical = (fieldMetadata: FieldMetadata): boolean => {
  return fieldMetadata.type === "FLOAT" || fieldMetadata.type === "INTEGER";
};

function createCategoricalValue(infoMetadata: FieldMetadata, value: ValueString): ValueCategorical {
  if (infoMetadata.categories === undefined) throw new RuntimeError();

  let valueDescription: ValueDescription | null;
  if (value !== null) {
    if (!(value in infoMetadata.categories)) {
      throw new RuntimeError(
        `invalid categorical field '${infoMetadata.id}' value '${value}' is not one of [${Object.keys(infoMetadata.categories).join(", ")}]`,
      );
    }
    valueDescription = infoMetadata.categories[value]!;
  } else {
    valueDescription = infoMetadata.nullValue || null;
  }
  return valueDescription && { ...valueDescription, value };
}

function getRecordSample(sample: SampleContainer, record: Item<VcfRecord>): RecordSample {
  const recordSample = record.data.s[sample.item.data.index];
  if (recordSample === undefined) throw new ArrayIndexOutOfBoundsException();
  return recordSample;
}

type ValueContainer = InfoContainer | RecordSample;

/**
 * Returns number of values for info field or for parent info field if exists
 */
export function getInfoValueCount(record: Item<VcfRecord>, fieldMetadata: FieldMetadata): number {
  const valueContainer: ValueContainer = record.data.n;
  return getFieldValueCount(fieldMetadata, valueContainer);
}

/**
 * Returns number of values for sample field or for parent sample field if exists
 */
export function getSampleValueCount(
  sample: SampleContainer,
  record: Item<VcfRecord>,
  fieldMetadata: FieldMetadata,
): number {
  const valueContainer: ValueContainer = getRecordSample(sample, record);
  return getFieldValueCount(fieldMetadata, valueContainer);
}

function getFieldValueCount(fieldMetadata: FieldMetadata, valueContainer: ValueContainer): number {
  let count: number;

  const parentFieldMetadata = fieldMetadata.parent;
  if (parentFieldMetadata && parentFieldMetadata.number.count !== 1) {
    if (parentFieldMetadata.id in valueContainer) {
      const value = valueContainer[parentFieldMetadata.id]!;
      if (!Array.isArray(value)) throw new RuntimeError();
      count = (value as Value[]).length;
    } else {
      count = 0;
    }
  } else {
    count = 1;
  }
  return count;
}

export function getInfoNestedField(
  metadata: VcfMetadataContainer,
  parentFieldId: FieldId,
  fieldId: FieldId,
): FieldMetadataWrapper | undefined {
  return getInfoNestedFields(metadata, parentFieldId, fieldId)[0];
}

export function getInfoNestedFields(
  metadata: VcfMetadataContainer,
  parentFieldId: FieldId,
  ...fieldIds: FieldId[]
): (FieldMetadataWrapper | undefined)[] {
  return getFields(metadata, `INFO/${parentFieldId}`, ...fieldIds);
}

export function getInfoField(metadata: VcfMetadataContainer, fieldId: FieldId): FieldMetadataWrapper | undefined {
  return getField(metadata, "INFO", fieldId);
}

export function getInfoFields(
  metadata: VcfMetadataContainer,
  ...fieldIds: FieldId[]
): (FieldMetadataWrapper | undefined)[] {
  return getFields(metadata, "INFO", ...fieldIds);
}

export function getInfoFieldsRegex(metadata: VcfMetadataContainer, regex: RegExp): FieldMetadataWrapper[] {
  return getFieldsRegex(metadata, "INFO", regex);
}

export function getSampleField(metadata: VcfMetadataContainer, fieldId: FieldId): FieldMetadataWrapper | undefined {
  return getField(metadata, "FORMAT", fieldId);
}

export function getSampleFields(
  metadata: VcfMetadataContainer,
  ...fieldIds: FieldId[]
): (FieldMetadataWrapper | undefined)[] {
  return getFields(metadata, "FORMAT", ...fieldIds);
}

export function getSampleNestedField(
  metadata: VcfMetadataContainer,
  parentFieldId: FieldId,
  fieldId: FieldId,
): FieldMetadataWrapper | undefined {
  return getSampleNestedFields(metadata, parentFieldId, fieldId)[0];
}

export function getSampleNestedFields(
  metadata: VcfMetadataContainer,
  parentFieldId: FieldId,
  ...fieldIds: FieldId[]
): (FieldMetadataWrapper | undefined)[] {
  return getFields(metadata, `FORMAT/${parentFieldId}`, ...fieldIds);
}

export function getSampleFieldsRegex(metadata: VcfMetadataContainer, regex: RegExp): FieldMetadataWrapper[] {
  return getFieldsRegex(metadata, "FORMAT", regex);
}

function getFields(
  metadata: VcfMetadataContainer,
  prefix: string,
  ...fieldIds: FieldId[]
): (FieldMetadataWrapper | undefined)[] {
  return fieldIds.map((fieldId) => getField(metadata, prefix, fieldId));
}

function getField(metadata: VcfMetadataContainer, prefix: string, fieldId: FieldId): FieldMetadataWrapper | undefined {
  return metadata.fieldMap[`${prefix}/${fieldId}`];
}

function getFieldsRegex(metadata: VcfMetadataContainer, prefix: string, regex: RegExp): FieldMetadataWrapper[] {
  return Object.entries(metadata.fieldMap)
    .filter(([key]) => key.startsWith(`${prefix}/`) && regex.test(key.substring(`${prefix}/`.length)))
    .map(([, value]) => value);
}

export function parseContigIds(metadata: VcfMetadata): string[] {
  return metadata.lines
    .filter((line) => line.startsWith("##contig="))
    .map((line) => {
      const tokens: { [index: string]: string } = {};
      for (const token of line.substring(10, line.length - 1).split(",")) {
        const keyValue = token.split("=");
        if (keyValue.length !== 2) throw new InvalidVcfError();
        tokens[keyValue[0]!] = keyValue[1]!;
      }
      const token = tokens["ID"];
      if (token === undefined) throw new InvalidVcfError();
      return token;
    });
}

export function getHeaderValue(metadata: VcfMetadata, key: string): string | null {
  const token = `##${key}=`;
  for (const line of metadata.lines) {
    if (line.startsWith(token)) {
      return line.substring(token.length);
    }
  }
  return null;
}
