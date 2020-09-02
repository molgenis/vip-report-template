import { InfoMetadata } from '@molgenis/vip-report-api';

export interface ConsequenceMetadata {
  effect: InfoMetadata;
  symbol: InfoMetadata;
  hgvsC: InfoMetadata;
  hgvsP: InfoMetadata;
  pubMed: InfoMetadata;
  clinVar: InfoMetadata;
  gnomAD: InfoMetadata;
}

export interface Consequence {
  effect: string[];
  symbol: string | null;
  hgvsC: string | null;
  hgvsP: string | null;
  pubMed: number[];
  clinVar: string[];
  gnomAD: number | null;
}

export interface Consequences {
  metadata: ConsequenceMetadata;
  items: Consequence[];
}
