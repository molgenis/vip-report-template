import { FieldMetadata, ValueDescription, ValueString } from "@molgenis/vip-report-vcf";

export const isNumerical = (fieldMetadata: FieldMetadata): boolean => {
  return fieldMetadata.type === "FLOAT" || fieldMetadata.type === "INTEGER";
};

export function abbreviateHeader(header: string) {
  return header.length > 13 ? header.slice(0, 11) + "\u2026" : header;
}

export function getCategoryLabelAndDescription(
  value: ValueString | undefined,
  infoMetadata: FieldMetadata,
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
