import { InfoMetadata, Record, RecordsMetadata } from '@molgenis/vip-report-api';
import { Consequence, ConsequenceMetadata, Consequences } from '@/types/Consequence';
import { Info } from '@/types/Info';

const consequenceMetadata: ConsequenceMetadata = {
  effect: { id: 'Consequence', type: 'STRING', number: { type: 'OTHER' }, description: 'Consequence' },
  symbol: { id: 'SYMBOL', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'SYMBOL' },
  hgvsC: { id: 'hgvsC', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsC' },
  hgvsP: { id: 'hgvsP', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsP' }
};

function createConsequence(
  info: Info,
  effectIndex: number | undefined,
  symbolIndex: number | undefined,
  hgvsCIndex: number | undefined,
  hgvsPIndex: number | undefined
): Consequence {
  return {
    effect: effectIndex !== undefined ? (info[effectIndex] as string[]) : [],
    symbol: symbolIndex !== undefined ? (info[symbolIndex] as string | null) : null,
    hgvsC: hgvsCIndex !== undefined ? (info[hgvsCIndex] as string | null) : null,
    hgvsP: hgvsPIndex !== undefined ? (info[hgvsPIndex] as string | null) : null
  };
}

function createConsequences(
  info: Info[],
  effectIndex: number | undefined,
  symbolIndex: number | undefined,
  hgvsCIndex: number | undefined,
  hgvsPIndex: number | undefined
): Consequence[] {
  const items = [];
  for (const item of info) {
    const consequence = createConsequence(item, effectIndex, symbolIndex, hgvsCIndex, hgvsPIndex);
    items.push(consequence);
  }

  return items;
}

function getInfoConsequences(
  infoMetadata: InfoMetadata,
  info: Info[],
  effectId: string,
  symbolId: string,
  hgvsCId: string,
  hgvsPId: string
): Consequence[] {
  if (infoMetadata.nested === undefined) {
    return [];
  }

  let effectIndex, symbolIndex, hgvsCIndex, hgvsPIndex;
  let index = 0;
  for (const nestedInfoMetadata of infoMetadata.nested) {
    switch (nestedInfoMetadata.id) {
      case effectId:
        effectIndex = index;
        break;
      case symbolId:
        symbolIndex = index;
        break;
      case hgvsCId:
        hgvsCIndex = index;
        break;
      case hgvsPId:
        hgvsPIndex = index;
        break;
      default:
        break;
    }
    ++index;
  }

  return createConsequences(info, effectIndex, symbolIndex, hgvsCIndex, hgvsPIndex);
}

function hasVepConsequences(metadata: RecordsMetadata): boolean {
  const csqInfo = metadata.info.find(item => item.id === 'CSQ');
  return csqInfo !== undefined;
}

function getVepConsequences(record: Record, metadata: RecordsMetadata): Consequence[] {
  const infoMetadata = metadata.info.find(item => item.id === 'CSQ');
  if (infoMetadata === undefined) {
    return [];
  }
  const info = (record.n as Info)['CSQ'] as Info[];
  return getInfoConsequences(infoMetadata, info, 'Consequence', 'SYMBOL', 'HGVSc', 'HGVSp');
}

function hasSnpEffConsequences(metadata: RecordsMetadata): boolean {
  const csqInfo = metadata.info.find(item => item.id === 'ANN');
  return csqInfo !== undefined;
}

function getSnpEffConsequences(record: Record, metadata: RecordsMetadata): Consequence[] {
  const infoMetadata = metadata.info.find(item => item.id === 'ANN');
  if (infoMetadata === undefined) {
    return [];
  }
  const info = (record.n as Info)['ANN'] as Info[];
  return getInfoConsequences(infoMetadata, info, 'Annotation', 'Gene_Name', 'HGVS.c', 'HGVS.p');
}

/**
 * Based on:
 * - http://grch37.ensembl.org/info/genome/variation/prediction/predicted_data.html#consequences
 * - http://snpeff.sourceforge.net/VCFannotationformat_v1.0.pdf
 */
/* eslint-disable @typescript-eslint/camelcase */
const soTermRank: { [index: string]: number } = {
  transcript_ablation: 0,
  chromosome_number_variation: 1,
  exon_loss_variant: 2,
  splice_acceptor_variant: 3,
  splice_donor_variant: 4,
  stop_gained: 5,
  frameshift_variant: 6,
  stop_lost: 7,
  start_lost: 8,
  transcript_amplification: 9,
  inframe_insertion: 10,
  disruptive_inframe_insertion: 10,
  conservative_inframe_insertion: 10,
  inframe_deletion: 11,
  disruptive_inframe_deletion: 11,
  conservative_inframe_deletion: 11,
  rare_amino_acid_variant: 12,
  missense_variant: 13,
  protein_altering_variant: 14,
  splice_region_variant: 15,
  splice_branch_variant: 15,
  incomplete_terminal_codon_variant: 16,
  start_retained_variant: 17,
  initiator_codon_variant: 17,
  stop_retained_variant: 18,
  synonymous_variant: 19,
  coding_sequence_variant: 20,
  mature_miRNA_variant: 21,
  '5_prime_UTR_variant': 22,
  '5_prime_UTR_truncation': 22,
  '5_prime_UTR_premature_start_codon_gain_variant': 22,
  '3_prime_UTR_variant': 23,
  '3_prime_UTR_truncation': 23,
  non_coding_transcript_exon_variant: 24,
  intron_variant: 25,
  conserved_intron_variant: 25,
  NMD_transcript_variant: 26,
  non_coding_transcript_variant: 27,
  upstream_gene_variant: 28,
  downstream_gene_variant: 29,
  TFBS_ablation: 30,
  TFBS_amplification: 31,
  TF_binding_site_variant: 32,
  regulatory_region_variant: 32,
  regulatory_region_ablation: 33,
  regulatory_region_amplification: 34,
  feature_elongation: 35,
  feature_truncation: 36,
  miRNA: 37,
  custom: 38,
  sequence_feature: 38,
  intragenic_variant: 40,
  conserved_intergenic_variant: 41,
  intergenic_variant: 42,
  intergenic_region: 43
};

function sortConsequences(thisConsequence: Consequence, thatConsequence: Consequence): number {
  let thisRank = Number.MAX_VALUE;

  for (const soTerm of thisConsequence.effect) {
    const rank = soTermRank[soTerm];
    if (rank < thisRank) {
      thisRank = rank;
    }
  }

  let thatRank = Number.MAX_VALUE;
  for (const soTerm of thatConsequence.effect) {
    const rank = soTermRank[soTerm];
    if (rank < thatRank) {
      thatRank = rank;
    }
  }

  return thisRank - thatRank;
}

export function getConsequences(record: Record, recordMetadata: RecordsMetadata): Consequences {
  const consequences: Consequence[] = [];
  if (hasVepConsequences(recordMetadata)) {
    consequences.push(...getVepConsequences(record, recordMetadata));
  }
  if (hasSnpEffConsequences(recordMetadata)) {
    consequences.push(...getSnpEffConsequences(record, recordMetadata));
  }
  consequences.sort(sortConsequences);
  return { metadata: consequenceMetadata, items: consequences };
}
