import { InfoMetadata } from '@molgenis/vip-report-api';

export interface ConsequenceMetadata {
  effect: InfoMetadata;
  symbol: InfoMetadata;
  hgvsC: InfoMetadata;
  hgvsP: InfoMetadata;
  pubMed: InfoMetadata;
}

export interface Consequence {
  effect: string[];
  symbol: string | null;
  hgvsC: string | null;
  hgvsP: string | null;
  pubMed: number[];
}

export interface Consequences {
  metadata: ConsequenceMetadata;
  items: Consequence[];
}
