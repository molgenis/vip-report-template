import { Item } from "@molgenis/vip-report-api";
import { FieldMetadata, RecordSample, VcfMetadata, VcfRecord } from "@molgenis/vip-report-vcf";
import { ArrayIndexOutOfBoundsException, InvalidIdException, InvalidVcfError } from "./error.ts";
import { SampleContainer } from "../Api.ts";

export function getRecordLabel(item: Item<VcfRecord>) {
  const record = item.data;
  return `${record.c}:${record.p} ${record.a
    .map(
      (a) =>
        `${record.r}>${a !== null ? (a.length > 4 ? a.substring(0, 2) + "\u2026" + a.charAt(a.length - 1) : a) : "."}`,
    )
    .join(" / ")}`;
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

export type FieldPath = string;
export type FieldMap = { [key: FieldPath]: FieldMetadata };

export function createFieldMap(metadata: VcfMetadata): FieldMap {
  const infoFields = createFieldMapTypedRec("INFO", Object.values(metadata.info));
  const formatFields = createFieldMapTypedRec("FORMAT", Object.values(metadata.format));
  return { ...infoFields, ...formatFields };
}

function createFieldMapTypedRec(
  keyPrefix: string,
  fieldMetadataList: FieldMetadata[],
): {
  [key: string]: FieldMetadata;
} {
  const fields: { [key: string]: FieldMetadata } = {};
  fieldMetadataList.forEach((fieldMetadata) => {
    const key = `${keyPrefix}/${fieldMetadata.id}`;
    fields[key] = fieldMetadata;
    if (fieldMetadata.nested) {
      Object.assign(fields, createFieldMapTypedRec(key, fieldMetadata.nested.items));
    }
  });
  return fields;
}

/**
 * Create an absolute url path from a list of components
 */
export function href(urlComponents: (string | number)[]) {
  return "/" + urlComponents.map((urlComponent) => encodeURIComponent(urlComponent)).join("/");
}

/**
 * Parse non-negative integer id
 */
export function parseId(id: string | undefined): number {
  const number = Number(id);
  if (!(Number.isInteger(number) && number >= 0)) {
    throw new InvalidIdException(id);
  }
  return number;
}

export function getRecordSample(record: Item<VcfRecord>, sample: SampleContainer): RecordSample {
  const recordSample = record.data.s[sample.item.data.index];
  if (recordSample === undefined) throw new ArrayIndexOutOfBoundsException();
  return recordSample;
}

export function abbreviateHeader(header: string) {
  return header.length > 13 ? header.slice(0, 11) + "\u2026" : header;
}
