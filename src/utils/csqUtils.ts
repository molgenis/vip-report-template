import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldValue } from "../components/record/field/Field";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

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

export function getCsqInfoIndex(infoMeta: FieldMetadata, id: string): number {
  return infoMeta.parent?.nested?.items.findIndex((item) => item.id === id) || -1;
}

export function getCsqInfo(info: FieldValue, infoIndex: number): Value {
  return (info.valueParent as Value[])[infoIndex];
}
