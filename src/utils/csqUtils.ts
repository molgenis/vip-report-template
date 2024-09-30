import { FieldMetadata, NestedFieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Direction } from "./sortUtils.ts";

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

export function getNestedFieldIndices(fieldMetadata: FieldMetadata, ids: string[]): number[] {
  return ids.map((id) => getNestedFieldIndex(fieldMetadata, id));
}

export function getNestedFieldIndex(fieldMetadata: FieldMetadata, id: string): number {
  if (fieldMetadata.nested === undefined) throw new Error(`field '${fieldMetadata.id}' is not nested`);
  return fieldMetadata.nested.items.findIndex((childFieldMetadata) => childFieldMetadata.id === id) || -1;
}

export function getFieldMultilineValue(
  fieldMetadata: FieldMetadata,
  record: Item<Record>,
  valueIndex: number,
  fieldIndex: number,
): Value | undefined {
  const csqValue = getNestedFieldValues(fieldMetadata, record)[valueIndex] as Value[];
  return csqValue[fieldIndex];
}

export function getFieldValueCount(fieldMetadata: FieldMetadata | undefined, record: Item<Record>) {
  return fieldMetadata ? getNestedFieldValues(fieldMetadata, record).length : 0;
}

function getNestedFieldValues(csqFieldMetadata: FieldMetadata, record: Item<Record>): ValueArray {
  return record.data.n[csqFieldMetadata.id] as ValueArray;
}

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

function compareCsqValue(aValue: number | null, bValue: number | null, direction: string): number {
  if (aValue === null) return bValue === null ? 0 : 1;
  if (bValue === null) return -1;
  return direction === "desc" ? bValue - aValue : aValue - bValue;
}

export function compareCsq(
  aValueArray: Value[],
  bValueArray: Value[],
  field: FieldMetadata,
  direction: Direction,
): number {
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

export function compareCsqDefault(
  aValue: Value[],
  bValue: Value[],
  pickIndex: number,
  consequenceIndex: number,
): number {
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
