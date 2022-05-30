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

export function getNestedInfoFieldsWithValues(infoFields: FieldMetadataContainer, infoValues: InfoContainer) {
  return Object.values(infoFields).filter((infoField) => infoField.nested && infoValues[infoField.id] !== undefined);
}

export function abbreviateHeader(header: string) {
  return header.length > 13 ? header.slice(0, 11) + "\u2026" : header;
}
