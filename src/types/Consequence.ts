import { InfoMetadata } from '@molgenis/vip-report-api';

export interface ConsequenceMetadata {
  effect: InfoMetadata;
  symbol: InfoMetadata;
  inheritance: InfoMetadata;
  hgvsC: InfoMetadata;
  hgvsP: InfoMetadata;
  pubMed: InfoMetadata;
  clinVar: InfoMetadata;
  gnomAD: InfoMetadata;
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
