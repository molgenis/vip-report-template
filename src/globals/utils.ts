import { Record, RecordsMetadata } from '@molgenis/vip-report-api';
import { Consequence } from '@/types/Consequence';
import { Info } from '@/types/Info';

function hasVepConsequences(metadata: RecordsMetadata): boolean {
  const csqInfo = metadata.info.find(item => item.id === 'CSQ');
  return csqInfo !== undefined;
}

function getVepConsequences(record: Record, metadata: RecordsMetadata): Consequence[] {
  const infoMetadata = metadata.info.find(item => item.id === 'CSQ');
  if (infoMetadata === undefined || infoMetadata.nested === undefined) {
    return [];
  }

  let effectIndex, symbolIndex, hgvsCIndex, hgvsPIndex;
  let index = 0;
  for (const nestedInfoMetadata of infoMetadata.nested) {
    switch (nestedInfoMetadata.id) {
      case 'Consequence':
        effectIndex = index;
        break;
      case 'SYMBOL':
        symbolIndex = index;
        break;
      case 'HGVSc':
        hgvsCIndex = index;
        break;
      case 'HGVSp':
        hgvsPIndex = index;
        break;
      default:
        break;
    }
    ++index;
  }

  const info = (record.n as Info)['CSQ'] as Info[];
  const consequences = [];
  for (const item of info) {
    const consequence: Consequence = {
      effect: effectIndex !== undefined ? (item[effectIndex] as string[]) : [],
      symbol: symbolIndex !== undefined ? (item[symbolIndex] as string | null) : null,
      hgvsC: hgvsCIndex !== undefined ? (item[hgvsCIndex] as string | null) : null,
      hgvsP: hgvsPIndex !== undefined ? (item[hgvsPIndex] as string | null) : null
    };
    consequences.push(consequence);
  }
  return consequences;
}

function hasSnpEffConsequences(metadata: RecordsMetadata): boolean {
  const csqInfo = metadata.info.find(item => item.id === 'ANN');
  return csqInfo !== undefined;
}

function getSnpEffConsequences(record: Record, metadata: RecordsMetadata): Consequence[] {
  const infoMetadata = metadata.info.find(item => item.id === 'ANN');
  if (infoMetadata === undefined || infoMetadata.nested === undefined) {
    return [];
  }

  let effectIndex, symbolIndex, hgvsCIndex, hgvsPIndex;
  let index = 0;
  for (const nestedInfoMetadata of infoMetadata.nested) {
    switch (nestedInfoMetadata.id) {
      case 'Annotation':
        effectIndex = index;
        break;
      case 'Gene_Name':
        symbolIndex = index;
        break;
      case 'HGVS.c':
        hgvsCIndex = index;
        break;
      case 'HGVS.p':
        hgvsPIndex = index;
        break;
      default:
        break;
    }
    ++index;
  }

  const info = (record.n as Info)['ANN'] as Info[];
  const consequences = [];
  for (const item of info) {
    const consequence: Consequence = {
      effect: effectIndex !== undefined ? (item[effectIndex] as string[]) : [],
      symbol: symbolIndex !== undefined ? (item[symbolIndex] as string | null) : null,
      hgvsC: hgvsCIndex !== undefined ? (item[hgvsCIndex] as string | null) : null,
      hgvsP: hgvsPIndex !== undefined ? (item[hgvsPIndex] as string | null) : null
    };
    consequences.push(consequence);
  }
  return consequences;
}

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
  if (!Array.isArray(thisConsequence.effect)) {
    console.log(typeof thisConsequence.effect, thisConsequence.effect);
  }
  if (!Array.isArray(thatConsequence.effect)) {
    console.log(typeof thatConsequence.effect, thatConsequence.effect);
  }
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

  if (thisRank === Number.MAX_VALUE) {
    console.log(thisConsequence.effect);
  }
  if (thatRank === Number.MAX_VALUE) {
    console.log(thatConsequence.effect);
  }

  return thisRank - thatRank;
}

export function getConsequences(record: Record, metadata: RecordsMetadata): Consequence[] {
  const consequences: Consequence[] = [];
  if (hasVepConsequences(metadata)) {
    consequences.push(...getVepConsequences(record, metadata));
  }
  if (hasSnpEffConsequences(metadata)) {
    consequences.push(...getSnpEffConsequences(record, metadata));
  }
  consequences.sort(sortConsequences);
  return consequences;
}
