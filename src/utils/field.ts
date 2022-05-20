import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldMetadataContainer, InfoContainer } from "@molgenis/vip-report-vcf/src/VcfParser";

const flattenFieldMetadataRec = (fieldMetadata: FieldMetadata): FieldMetadata[] => {
  return fieldMetadata.nested ? fieldMetadata.nested.items.flatMap(flattenFieldMetadataRec) : [fieldMetadata];
};

export const flattenFieldMetadata = (fieldMetadataContainer: FieldMetadataContainer): FieldMetadata[] => {
  return Object.values(fieldMetadataContainer).flatMap(flattenFieldMetadataRec);
};

export const isNumerical = (fieldMetadata: FieldMetadata): boolean => {
  return fieldMetadata.type === "FLOAT" || fieldMetadata.type === "INTEGER";
};

export const getFullId = (fieldMetadata: FieldMetadata): string => {
  return fieldMetadata.parent ? fieldMetadata.parent.id + "/" + fieldMetadata.id : fieldMetadata.id;
};

export function getNestedInfoFieldsWithValues(infoFields: FieldMetadataContainer, infoValues: InfoContainer) {
  return Object.values(infoFields).filter((infoField) => infoField.nested && infoValues[infoField.id] !== undefined);
}

export function filterFieldMetadata(
  infoFields: FieldMetadataContainer,
  fields: { [key: string]: string },
  nestedFields: { [key: string]: string }
): FieldMetadataContainer {
  const filteredInfoFields: FieldMetadataContainer = {};
  for (const [key, infoField] of Object.entries(infoFields)) {
    const filteredInfoField = { ...infoField };
    if (filteredInfoField.nested) {
      filteredInfoField.nested = { ...infoField.nested };
      filteredInfoField.nested.items = infoField.nested.items.filter((item) => nestedFields[item.id] !== undefined);
      filteredInfoFields[key] = filteredInfoField;
    } else if (fields[infoField.id] !== undefined) {
      filteredInfoFields[key] = filteredInfoField;
    }
  }
  return filteredInfoFields;
}
