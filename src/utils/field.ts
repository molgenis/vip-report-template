import { FieldMetadata } from "../api/vcf/MetadataParser";
import { FieldMetadataContainer, InfoContainer } from "../api/vcf/VcfParser";

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
