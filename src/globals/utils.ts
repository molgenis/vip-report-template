import { Vcf, Api } from '@molgenis/vip-report-api';
import { Consequence, ConsequenceMetadata, Consequences } from '@/types/Consequence';
import { Variant } from '@/types/Variant';

const consequenceMetadata: ConsequenceMetadata = {
  effect: {
    id: 'Consequence',
    type: 'STRING',
    number: { type: 'OTHER' },
    description: 'Consequence'
  },
  symbol: { id: 'SYMBOL', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'SYMBOL' },
  incompletePenetrance: {
    id: 'IncompletePenetrance',
    type: 'FLAG',
    number: { type: 'NUMBER', count: 1 },
    description: 'IncompletePenetrance'
  },
  inheritance: {
    id: 'InheritanceModesGene',
    type: 'STRING',
    number: { type: 'OTHER' },
    description: 'InheritanceModesGene'
  },
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
  },
  mvl: {
    id: 'VKGL_UMCG',
    type: 'STRING',
    number: { type: 'NUMBER', count: 1 },
    description: 'UMCG Managed variant list Classification'
  },
  vkgl: {
    id: 'VKGL_CL',
    type: 'STRING',
    number: { type: 'NUMBER', count: 1 },
    description: 'VKGL public consensus'
  }
};

function createConsequence(
  info: Vcf.Value[],
  effectIndex: number | undefined,
  symbolIndex: number | undefined,
  incompletePenetranceIndex: number | undefined,
  inheritanceIndex: number | undefined,
  hgvsCIndex: number | undefined,
  hgvsPIndex: number | undefined,
  pubMedIndex: number | undefined,
  clinVarIndex: number | undefined,
  gnomADIndex: number | undefined,
  mvlIndex: number | undefined,
  vkglIndex: number | undefined,
  primaryIndex: number | undefined,
  alleleIndexIndex: number | undefined
): Consequence {
  return {
    effect: effectIndex !== undefined ? (info[effectIndex] as string[]) : [],
    symbol: symbolIndex !== undefined ? (info[symbolIndex] as string | null) : null,
    incompletePenetrance:
      incompletePenetranceIndex !== undefined ? (info[incompletePenetranceIndex] as boolean) : false,
    inheritance: inheritanceIndex !== undefined ? (info[inheritanceIndex] as string[]) : [],
    hgvsC: hgvsCIndex !== undefined ? (info[hgvsCIndex] as string | null) : null,
    hgvsP: hgvsPIndex !== undefined ? (info[hgvsPIndex] as string | null) : null,
    pubMed: pubMedIndex !== undefined ? (info[pubMedIndex] as number[]) : [],
    clinVar: clinVarIndex !== undefined ? (info[clinVarIndex] as string[]) : [],
    gnomAD: gnomADIndex !== undefined ? (info[gnomADIndex] as number) : null,
    mvl: mvlIndex !== undefined ? (info[mvlIndex] as string | null) : null,
    vkgl: vkglIndex !== undefined ? (info[vkglIndex] as string | null) : null,
    primary: primaryIndex !== undefined ? (info[primaryIndex] as string) : null,
    alleleIndex: alleleIndexIndex != undefined ? (info[alleleIndexIndex] as number) : null
  };
}

function createConsequences(
  info: Vcf.Value[][],
  effectIndex: number | undefined,
  symbolIndex: number | undefined,
  incompletePenetranceIndex: number | undefined,
  inheritanceIndex: number | undefined,
  hgvsCIndex: number | undefined,
  hgvsPIndex: number | undefined,
  pubMedIndex: number | undefined,
  clinVarIndex: number | undefined,
  gnomADIndex: number | undefined,
  mvlIndex: number | undefined,
  vkglIndex: number | undefined,
  primaryIndex: number | undefined,
  alleleIndexIndex: number | undefined
): Consequence[] {
  const items = [];
  for (const item of info) {
    const consequence = createConsequence(
      item,
      effectIndex,
      symbolIndex,
      incompletePenetranceIndex,
      inheritanceIndex,
      hgvsCIndex,
      hgvsPIndex,
      pubMedIndex,
      clinVarIndex,
      gnomADIndex,
      mvlIndex,
      vkglIndex,
      primaryIndex,
      alleleIndexIndex
    );
    items.push(consequence);
  }

  return items;
}

function getInfoConsequences(
  infoMetadata: Vcf.InfoMetadata,
  info: Vcf.Value[][],
  effectId: string,
  symbolId: string,
  incompletePenetranceId: string | null,
  inheritanceId: string | null,
  hgvsCId: string,
  hgvsPId: string,
  pubMedId: string | null,
  clinVarId: string | null,
  gnomADId: string | null,
  mvlId: string | null,
  vkglId: string | null,
  primaryId: string | null,
  alleleIndexId: string | null
): Consequence[] {
  if (infoMetadata.nested === undefined) {
    return [];
  }

  let effectIndex,
    symbolIndex,
    incompletePenetranceIndex,
    inheritanceIndex,
    hgvsCIndex,
    hgvsPIndex,
    pubMedIndex,
    clinVarIndex,
    gnomADIndex,
    mvlIndex,
    vkglIndex,
    primaryIndex,
    alleleIndexIndex;
  let index = 0;
  for (const nestedInfoMetadata of Object.values(infoMetadata.nested.items)) {
    switch (nestedInfoMetadata.id) {
      case effectId:
        effectIndex = index;
        break;
      case symbolId:
        symbolIndex = index;
        break;
      case incompletePenetranceId:
        incompletePenetranceIndex = index;
        break;
      case inheritanceId:
        inheritanceIndex = index;
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
      case mvlId:
        mvlIndex = index;
        break;
      case vkglId:
        vkglIndex = index;
        break;
      case primaryId:
        primaryIndex = index;
        break;
      case alleleIndexId:
        alleleIndexIndex = index;
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
    incompletePenetranceIndex,
    inheritanceIndex,
    hgvsCIndex,
    hgvsPIndex,
    pubMedIndex,
    clinVarIndex,
    gnomADIndex,
    mvlIndex,
    vkglIndex,
    primaryIndex,
    alleleIndexIndex
  );
}

function hasVepConsequences(metadata: Vcf.Metadata): boolean {
  const csqInfo = metadata.info['CSQ'];
  return csqInfo !== undefined;
}

function getVepConsequences(record: Vcf.Record, metadata: Vcf.Metadata): Consequence[] {
  const infoMetadata = metadata.info['CSQ'];
  if (infoMetadata === undefined || record.n === undefined) {
    return [];
  }
  const info = record.n;
  if (!Object.prototype.hasOwnProperty.call(info, 'CSQ') && info.CSQ !== null) {
    return [];
  }
  const csqInfo = info.CSQ as Vcf.Value[][];
  return getInfoConsequences(
    infoMetadata,
    csqInfo,
    'Consequence',
    'SYMBOL',
    'IncompletePenetrance',
    'InheritanceModesGene',
    'HGVSc',
    'HGVSp',
    'PUBMED',
    'CLIN_SIG',
    'gnomAD_AF',
    'VKGL_UMCG',
    'VKGL_CL',
    'PICK',
    'ALLELE_NUM'
  );
}

function hasSnpEffConsequences(metadata: Vcf.Metadata): boolean {
  const csqInfo = metadata.info['ANN'];
  return csqInfo !== undefined;
}

function getSnpEffConsequences(record: Vcf.Record, metadata: Vcf.Metadata): Consequence[] {
  const infoMetadata = metadata.info['ANN'];
  if (infoMetadata === undefined || record.n === undefined) {
    return [];
  }
  const info = record.n;
  if (!Object.prototype.hasOwnProperty.call(info, 'ANN') && info.ANN !== null) {
    return [];
  }
  const annInfo = info.ANN as Vcf.Value[][];
  return getInfoConsequences(
    infoMetadata,
    annInfo,
    'Annotation',
    'Gene_Name',
    null,
    null,
    'HGVS.c',
    'HGVS.p',
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
}

/**
 * Based on:
 * - http://grch37.ensembl.org/info/genome/variation/prediction/predicted_data.html#consequences
 * - http://snpeff.sourceforge.net/VCFannotationformat_v1.0.pdf
 */
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
  if (thisConsequence.primary === '1' && thatConsequence.primary !== '1') {
    return -1;
  } else if (thatConsequence.primary === '1') {
    return 1;
  } else {
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
}

/**
 * Returns consequences extracted from various info fields
 */
export function getConsequences(record: Vcf.Record, recordMetadata: Vcf.Metadata): Consequences {
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

function getVepPhenotypesIndex(metadata: Vcf.Metadata): number | null {
  const infoMetadata = metadata.info['CSQ'];
  if (infoMetadata === undefined || infoMetadata.nested === undefined) {
    return null;
  }

  let index = 0;
  for (const nestedInfoMetadata of Object.values(infoMetadata.nested.items)) {
    if (nestedInfoMetadata.id === 'HPO') {
      return index;
    }
    ++index;
  }
  return null;
}

export function getPhenotypesSelector(recordMetadata: Vcf.Metadata): Api.Selector {
  const index = getVepPhenotypesIndex(recordMetadata);
  if (index === null) {
    throw new Error('phenotypes unavailable');
  }
  return ['n', 'CSQ', '*', index];
}

function getVepInheritanceModesGeneIndex(metadata: Vcf.Metadata): number | null {
  const infoMetadata = metadata.info['CSQ'];
  if (infoMetadata === undefined || infoMetadata.nested === undefined) {
    return null;
  }

  let index = 0;
  for (const nestedInfoMetadata of Object.values(infoMetadata.nested.items)) {
    if (nestedInfoMetadata.id === 'InheritanceModesGene') {
      return index;
    }
    ++index;
  }
  return null;
}

export function getInheritanceModesGeneSelector(recordMetadata: Vcf.Metadata): Api.Selector {
  const index = getVepInheritanceModesGeneIndex(recordMetadata);
  if (index === null) {
    throw new Error('inheritance modes gene unavailable');
  }
  return ['n', 'CSQ', '*', index];
}

export function getVariant(record: Vcf.Record, consequence: Consequence): Variant | null {
  let variant;
  if (consequence.alleleIndex !== null) {
    variant = {
      chr: record.c,
      pos: record.p,
      ref: record.r,
      alt: record.a[consequence.alleleIndex - 1]
    };
  } else {
    variant = null;
  }
  return variant;
}
