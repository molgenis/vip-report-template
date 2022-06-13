import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldMetadataContainer, InfoContainer } from "@molgenis/vip-report-vcf/src/VcfParser";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { Selector, SortPath } from "@molgenis/vip-report-api/src/Api";

export function selectorKey(selector: Selector): string {
  return Array.isArray(selector) ? selector.join("/") : selector.toString();
}

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

class InvalidFieldPathError extends Error {
  constructor(path: SortPath) {
    super(`invalid path '[${path.join(", ")}]'`);
    this.name = "InvalidFieldPathError";
  }
}

export function findInfoField(recordsMetadata: Metadata, path: SortPath): FieldMetadata | undefined {
  if (path.length < 2 || path[0] !== "n") throw new InvalidFieldPathError(path);

  let field = recordsMetadata.info[path[1]];
  if (field === undefined) throw new InvalidFieldPathError(path);

  for (let i = 2; i < path.length; ++i) {
    const fieldIndex = Number(path[i]);
    if (!Number.isInteger(fieldIndex) || fieldIndex < 0) throw new InvalidFieldPathError(path);

    const fieldItems = field.nested?.items;
    if (fieldItems === undefined || fieldIndex >= fieldItems.length) throw new InvalidFieldPathError(path);

    field = fieldItems[fieldIndex];
  }
  return field;
}
