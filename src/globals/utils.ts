import { InfoMetadata, InfoValue, Record, RecordsMetadata } from '@molgenis/vip-report-api';
import { Consequence, ConsequenceMetadata, Consequences } from '@/types/Consequence';

const consequenceMetadata: ConsequenceMetadata = {
  effect: { id: 'Consequence', type: 'STRING', number: { type: 'OTHER' }, description: 'Consequence' },
  symbol: { id: 'SYMBOL', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'SYMBOL' },
  hgvsC: { id: 'hgvsC', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsC' },
  hgvsP: { id: 'hgvsP', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsP' },
  pubMed: {
    id: 'PUBMED',
    type: 'INTEGER',
    number: { type: 'OTHER' },
    description: 'Pubmed ID(s) of publications that cite existing variant'
  },
  clinVar: {
    id: 'CLIN_SIG',
    type: 'STRING',
    number: { type: 'OTHER' },
    description: 'ClinVar clinical significance of the dbSNP variant'
  },
  gnomAD: {
    id: 'gnomAD_AF',
    type: 'FLOAT',
    number: { type: 'NUMBER', count: 1 },
    description: 'Frequency of existing variant in gnomAD exomes combined population'
  }
};

function createConsequence(
  info: InfoValue[],
  effectIndex: number | undefined,
  symbolIndex: number | undefined,
  hgvsCIndex: number | undefined,
  hgvsPIndex: number | undefined,
  pubMedIndex: number | undefined,
  clinVarIndex: number | undefined,
  gnomADIndex: number | undefined
): Consequence {
  return {
    effect: effectIndex !== undefined ? (info[effectIndex] as string[]) : [],
    symbol: symbolIndex !== undefined ? (info[symbolIndex] as string | null) : null,
    hgvsC: hgvsCIndex !== undefined ? (info[hgvsCIndex] as string | null) : null,
    hgvsP: hgvsPIndex !== undefined ? (info[hgvsPIndex] as string | null) : null,
    pubMed: pubMedIndex !== undefined ? (info[pubMedIndex] as number[]) : [],
    clinVar: clinVarIndex !== undefined ? (info[clinVarIndex] as string[]) : [],
    gnomAD: gnomADIndex !== undefined ? (info[gnomADIndex] as number) : null
  };
}

function createConsequences(
  info: InfoValue[][],
  effectIndex: number | undefined,
  symbolIndex: number | undefined,
  hgvsCIndex: number | undefined,
  hgvsPIndex: number | undefined,
  pubMedIndex: number | undefined,
  clinVarIndex: number | undefined,
  gnomADIndex: number | undefined
): Consequence[] {
  const items = [];
  for (const item of info) {
    const consequence = createConsequence(
      item,
      effectIndex,
      symbolIndex,
      hgvsCIndex,
      hgvsPIndex,
      pubMedIndex,
      clinVarIndex,
      gnomADIndex
    );
    items.push(consequence);
  }

  return items;
}

function getInfoConsequences(
  infoMetadata: InfoMetadata,
  info: InfoValue[][],
  effectId: string,
  symbolId: string,
  hgvsCId: string,
  hgvsPId: string,
  pubMedId: string | null,
  clinVarId: string | null,
  gnomADId: string | null
): Consequence[] {
  if (infoMetadata.nested === undefined) {
    return [];
  }

  let effectIndex, symbolIndex, hgvsCIndex, hgvsPIndex, pubMedIndex, clinVarIndex, gnomADIndex;
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
      case pubMedId:
        pubMedIndex = index;
        break;
      case clinVarId:
        clinVarIndex = index;
        break;
      case gnomADId:
        gnomADIndex = index;
        break;
      default:
        break;
    }
    ++index;
  }

  return createConsequences(
    info,
    effectIndex,
    symbolIndex,
    hgvsCIndex,
    hgvsPIndex,
    pubMedIndex,
    clinVarIndex,
    gnomADIndex
  );
}

function hasVepConsequences(metadata: RecordsMetadata): boolean {
  const csqInfo = metadata.info.find(item => item.id === 'CSQ');
  return csqInfo !== undefined;
}

function getVepConsequences(record: Record, metadata: RecordsMetadata): Consequence[] {
  const infoMetadata = metadata.info.find(item => item.id === 'CSQ');
  if (infoMetadata === undefined || record.n === undefined) {
    return [];
  }
  const info = record.n;
  if (!Object.prototype.hasOwnProperty.call(info, 'CSQ') && info.CSQ !== null) {
    return [];
  }
  const csqInfo = info.CSQ as InfoValue[][];
  return getInfoConsequences(
    infoMetadata,
    csqInfo,
    'Consequence',
    'SYMBOL',
    'HGVSc',
    'HGVSp',
    'PUBMED',
    'CLIN_SIG',
    'gnomAD_AF'
  );
}

function hasSnpEffConsequences(metadata: RecordsMetadata): boolean {
  const csqInfo = metadata.info.find(item => item.id === 'ANN');
  return csqInfo !== undefined;
}

function getSnpEffConsequences(record: Record, metadata: RecordsMetadata): Consequence[] {
  const infoMetadata = metadata.info.find(item => item.id === 'ANN');
  if (infoMetadata === undefined || record.n === undefined) {
    return [];
  }
  const info = record.n;
  if (!Object.prototype.hasOwnProperty.call(info, 'ANN') && info.ANN !== null) {
    return [];
  }
  const annInfo = info.ANN as InfoValue[][];
  return getInfoConsequences(infoMetadata, annInfo, 'Annotation', 'Gene_Name', 'HGVS.c', 'HGVS.p', null, null, null);
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

/**
 * Returns consequences extracted from various info fields
 */
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
