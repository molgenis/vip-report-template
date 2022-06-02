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
  SortOrder,
  SortPath,
} from "@molgenis/vip-report-api/src/Api";
import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import api from "../Api";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata, InfoMetadata, NestedFieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { isNumerical } from "./field";

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

const consequenceOrder = [
  "transcript_ablation",
  "splice_acceptor_variant",
  "splice_donor_variant",
  "splice_donor_5th_base_variant",
  "splice_donor_region_variant",
  "splice_polypyrimidine_tract_variant",
  "stop_gained",
  "frameshift_variant",
  "stop_lost",
  "start_lost",
  "transcript_amplification",
  "inframe_insertion",
  "inframe_deletion",
  "missense_variant",
  "protein_altering_variant",
  "splice_region_variant",
  "incomplete_terminal_codon_variant",
  "start_retained_variant",
  "stop_retained_variant",
  "synonymous_variant",
  "coding_sequence_variant",
  "mature_miRNA_variant",
  "5_prime_UTR_variant",
  "3_prime_UTR_variant",
  "non_coding_transcript_exon_variant",
  "intron_variant",
  "NMD_transcript_variant",
  "non_coding_transcript_variant",
  "upstream_gene_variant",
  "downstream_gene_variant",
  "TFBS_ablation",
  "TFBS_amplification",
  "TF_binding_site_variant",
  "regulatory_region_ablation",
  "regulatory_region_amplification",
  "feature_elongation",
  "regulatory_region_variant",
  "feature_truncation",
  "intergenic_variant",
].reduce((acc: { [key: string]: number }, curr, currIndex) => ((acc[curr] = currIndex), acc), {});

function getMostSevereConsequenceIndex(value: string[]) {
  return value.map((consequence) => consequenceOrder[consequence]).reduce((max, value) => Math.max(max, value));
}

function getCsqSortOrders(params: Params, csqMetadata: InfoMetadata): SortOrder[] {
  const sortOrders = params.sort ? (Array.isArray(params.sort) ? params.sort : [params.sort]) : [];
  if (Array.isArray(params.sort)) {
    return sortOrders.filter((sortOrder) => {
      const csqIndex = sortOrder.property.indexOf("CSQ");
      const childMetadata = csqMetadata.nested?.items[sortOrder.property[csqIndex + 1] as number];
      if (childMetadata === undefined) {
        throw new Error(`Unknown field for path: ${sortOrder.property[csqIndex + 1]}`);
      }
      return (
        (sortOrder.compare === undefined || typeof sortOrder.compare !== "function") &&
        csqIndex !== -1 &&
        isNumerical(childMetadata) &&
        childMetadata.number.type === "NUMBER" &&
        childMetadata.number.count === 1
      );
    });
  }
}

function compareCsqValue(aValue: number | null, bValue: number | null, direction: string): number {
  if (aValue === null) return bValue === null ? 0 : 1;
  if (bValue === null) return -1;
  return direction === "desc" ? bValue - aValue : aValue - bValue;
}

function compareCsq(aValueArray: Value[], bValueArray: Value[], field: SortPath, direction: string): number {
  const parentField = field.parent as FieldMetadata;
  const parentItems = (parentField.nested as NestedFieldMetadata).items;

  const index = parentItems.findIndex((item) => item.id === field.id);
  if (index === -1) {
    throw new Error(`unknown field '${field.id}'`);
  }

  const aValue = aValueArray[index] as number | null;
  const bValue = bValueArray[index] as number | null;
  return compareCsqValue(aValue, bValue, direction);
}

function compareCsqDefault(aValue: Value[], bValue: Value[], pickIndex: number, consequenceIndex: number): number {
  if (pickIndex !== -1) {
    if (aValue[pickIndex] === "1") return bValue[pickIndex] === null ? -1 : 0;
    if (bValue[pickIndex] === "1") return 1;
  }

  if (consequenceIndex !== -1) {
    const aIndex = getMostSevereConsequenceIndex(aValue[consequenceIndex] as string[]);
    const bIndex = getMostSevereConsequenceIndex(bValue[consequenceIndex] as string[]);
    return aIndex - bIndex;
  } else {
    return 0;
  }
}

export async function fetchRecords(params: Params) {
  const [recordsMeta, records] = await Promise.all([api.getRecordsMeta(), api.getRecords(params)]);
  if (recordsMeta.info.CSQ === undefined) {
    return records;
  }

  const sortOrders = getCsqSortOrders(params, recordsMeta.info.CSQ);

  const fieldMetas = (recordsMeta.info.CSQ.nested as NestedFieldMetadata).items;
  const consequenceIndex = fieldMetas.findIndex((item) => item.id === "Consequence");
  const pickIndex = fieldMetas.findIndex((item) => item.id === "PICK");

  for (const record of records.items) {
    const csqArray = record.data.n.CSQ as Value[][];

    csqArray.sort((aValue, bValue) => {
      for (const sortOrder of sortOrders) {
        const compareValue = compareCsq(aValue, bValue, sortOrder.property, sortOrder.compare as string);
        if (compareValue !== 0) return compareValue;
      }
      return compareCsqDefault(aValue, bValue, pickIndex, consequenceIndex);
    });
  }
  return records;
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

export function toString(item: Item<Record>) {
  const record = item.data;
  return `${record.c}:${record.p} ${record.a.map((a) => `${record.r}>${a !== null ? a : "."}`).join(" / ")}`;
}

export function getPath(field: FieldMetadata): SortPath {
  const path = [];
  do {
    const parent = field.parent;
    if (parent && parent.number.count !== 1) {
      const index = (parent.nested as NestedFieldMetadata).items.findIndex((item) => field.id === item.id);
      if (index === -1) {
        throw new UnknownFieldError(field.id, path);
      }
      path.push(index);
    } else {
      path.push(field.id);
    }

    if (parent) field = parent;
    else break;
  } while (true);
  path.push("n");
  path.reverse();

  return path;
}

class UnknownFieldError extends Error {
  constructor(fieldId: string, path: (string | number)[]) {
    super(`unknown field '${fieldId}' in path '[${path.join(",")}]'`);
    this.name = "UnknownFieldError";
  }
}
