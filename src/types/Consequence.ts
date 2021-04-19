import { Vcf } from '@molgenis/vip-report-api';

export interface ConsequenceMetadata {
  effect: Vcf.InfoMetadata;
  symbol: Vcf.InfoMetadata;
  inheritance: Vcf.InfoMetadata;
  hgvsC: Vcf.InfoMetadata;
  hgvsP: Vcf.InfoMetadata;
  pubMed: Vcf.InfoMetadata;
  clinVar: Vcf.InfoMetadata;
  gnomAD: Vcf.InfoMetadata;
}

export interface Consequence {
  alleleIndex: number | null;
  effect: string[];
  symbol: string | null;
  inheritance: string[];
  hgvsC: string | null;
  hgvsP: string | null;
  pubMed: number[];
  clinVar: string[];
  gnomAD: number | null;
  primary: string | null;
}

export interface Consequences {
  metadata: ConsequenceMetadata;
  items: Consequence[];
}
