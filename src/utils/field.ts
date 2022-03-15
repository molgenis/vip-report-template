import { FieldMetadata } from "../api/vcf/MetadataParser";
import { FieldMetadataContainer } from "../api/vcf/VcfParser";

function flattenFieldMetadataRec(fieldMetadata: FieldMetadata): FieldMetadata[] {
  return fieldMetadata.nested ? fieldMetadata.nested.items.flatMap(flattenFieldMetadataRec) : [fieldMetadata];
}

export function flattenFieldMetadata(fieldMetadataContainer: FieldMetadataContainer): FieldMetadata[] {
  return Object.values(fieldMetadataContainer).flatMap(flattenFieldMetadataRec);
}

export function getId(fieldMetadata: FieldMetadata): string {
  const tokens = [];
  let currentFieldMetadata: FieldMetadata | undefined = fieldMetadata;
  while (currentFieldMetadata) {
    tokens.push(currentFieldMetadata.id);
    currentFieldMetadata = currentFieldMetadata.parent;
  }
  return tokens.reverse().join("/");
}
