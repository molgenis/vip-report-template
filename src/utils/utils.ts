import {
  DecisionTree,
  Item,
  LeafNode,
  PagedItems,
  Params,
  Phenotype,
  Resource,
  Sample,
} from "../../../vip-report-api/src/Api";
import { Metadata, Record } from "../../../vip-report-vcf/src/Vcf.ts";
import { FieldMetadata } from "../../../vip-report-vcf/src/types/Metadata";

export function arrayEquals<T>(a: T[], b: T[]) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

export function getRecordLabel(item: Item<Record>) {
  const record = item.data;
  return `${record.c}:${record.p} ${record.a
    .map(
      (a) =>
        `${record.r}>${a !== null ? (a.length > 4 ? a.substring(0, 2) + "\u2026" + a.charAt(a.length - 1) : a) : "."}`,
    )
    .join(" / ")}`;
}

export function parseContigIds(metadata: Metadata) {
  return metadata.lines
    .filter((line) => line.startsWith("##contig="))
    .map((line) => {
      const tokens: { [index: string]: string } = {};
      for (const token of line.substring(10, line.length - 1).split(",")) {
        const keyValue = token.split("=");
        tokens[keyValue[0]] = keyValue[1];
      }
      return tokens["ID"];
    });
}

export type FieldPath = string;
export type FieldMap = { [key: FieldPath]: FieldMetadata };

export function createFieldMap(metadata: Metadata): FieldMap {
  //FIXME recursive to support deep nesting
  //TODO merge INFO and FORMAT code paths
  const fields: { [key: string]: FieldMetadata } = {};
  Object.entries(metadata.info).forEach(([key, value]) => {
    fields[`INFO/${key}`] = value;
    if (value.nested) {
      for (const fieldMetadata of value.nested.items) {
        fields[`INFO/${value.id}/${fieldMetadata.id}`] = fieldMetadata;
      }
    }
  });

  Object.entries(metadata.format).forEach(([key, value]) => {
    if (value.nested) {
      for (const fieldMetadata of value.nested.items) {
        fields[`FORMAT/${value.id}/${fieldMetadata.id}`] = fieldMetadata;
      }
    } else {
      fields[`FORMAT/${key}`] = value;
    }
  });
  return fields;
}

//TODO get rid of
export const EMPTY_PARAMS: Params = {};

//TODO get rid of
export function createEmptyPagedItems(): PagedItems<Resource> {
  return {
    page: { number: 0, size: 0, totalElements: 0 },
    items: [],
    total: 0,
  };
}

//TODO get rid of
export const EMPTY_RECORDS_PAGE = createEmptyPagedItems() as PagedItems<Record>;
//TODO get rid of
export const EMPTY_SAMPLES_PAGE = createEmptyPagedItems() as PagedItems<Sample>;
// TODO get rid of
export const EMPTY_PHENOTYPES = createEmptyPagedItems() as PagedItems<Phenotype>;
// TODO get rid of
export const EMPTY_DECISION_TREE: DecisionTree = {
  rootNode: "root",
  nodes: { root: { type: "LEAF", description: "x", class: "x" } as LeafNode },
  labels: {},
  files: {},
};
