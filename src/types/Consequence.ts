import { InfoMetadata } from '@molgenis/vip-report-api';

export interface ConsequenceMetadata {
  effect: InfoMetadata;
  symbol: InfoMetadata;
  hgvsC: InfoMetadata;
  hgvsP: InfoMetadata;
}

export interface Consequence {
  effect: string[];
  symbol: string | null;
  hgvsC: string | null;
  hgvsP: string | null;
}

export interface Consequences {
  metadata: ConsequenceMetadata;
  items: Consequence[];
}
