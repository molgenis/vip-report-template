import {
  AppMetadata,
  DecisionTree,
  HtsFileMetadata,
  Item,
  LeafNode,
  PagedItems,
  Params,
  Phenotype,
  Resource,
  Sample,
} from "@molgenis/vip-report-api/src/Api";
import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import api from "../Api";

export const EMPTY_PARAMS: Params = {};

function createEmptyPagedItems(): PagedItems<Resource> {
  return {
    page: { number: 0, size: 0, totalElements: 0 },
    items: [],
    total: 0,
  };
}

export const EMPTY_RECORDS_PAGE = createEmptyPagedItems() as PagedItems<Record>;

export const EMPTY_SAMPLES_PAGE = createEmptyPagedItems() as PagedItems<Sample>;

export const EMPTY_SAMPLES = [] as Sample[];

export async function fetchRecords(params: Params) {
  return await api.getRecords(params);
}

export async function fetchRecordsMeta() {
  return await api.getRecordsMeta();
}

export const EMPTY_RECORDS_METADATA: Metadata = {
  lines: [],
  info: {},
  format: {},
  samples: [],
};

export async function fetchDecisionTree() {
  return await api.getDecisionTree();
}

export async function fetchSampleById(id: string) {
  return await api.getSampleById(Number(id));
}

export async function fetchRecordById(id: string) {
  return await api.getRecordById(Number(id));
}

export async function fetchSamples(params: Params) {
  return await api.getSamples(params);
}

export async function fetchPhenotypes(params: Params) {
  return await api.getPhenotypes(params);
}

export const EMPTY_PHENOTYPES = createEmptyPagedItems() as PagedItems<Phenotype>;

export const EMPTY_DECISION_TREE: DecisionTree = {
  rootNode: "root",
  nodes: { root: { type: "LEAF", description: "x", class: "x" } as LeafNode },
  labels: {},
  files: {},
};

export async function fetchHtsFileMetadata() {
  return await api.getHtsFileMetadata();
}

export async function fetchAppMetadata() {
  return await api.getAppMetadata();
}

export const EMPTY_HTS_FILE_METADATA: HtsFileMetadata = {
  htsFormat: "x",
  uri: "x",
  genomeAssembly: "x",
};

export const EMPTY_APP_METADATA: AppMetadata = {
  name: "x",
  version: "x",
  args: "x",
};

export async function fetchPedigreeSamples(sample: Item<Sample>): Promise<Sample[]> {
  return (
    await api.getSamples({
      query: {
        operator: "and",
        args: [
          { selector: ["person", "individualId"], operator: "!=", args: sample.data.person.individualId },
          { selector: ["person", "familyId"], operator: "==", args: sample.data.person.familyId },
        ],
      },
      size: Number.MAX_SAFE_INTEGER,
    })
  ).items.map((item) => item.data);
}
