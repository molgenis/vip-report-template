import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

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
