import { Metadata, PagedItems, Phenotype, Record, Sample } from '@molgenis/vip-report-api';
import { Alert } from '@/types/Alert';

export type State = {
  alerts: Array<Alert>;
  metadata: Metadata | null;
  samples: PagedItems<Sample> | null;
  selectedSample: Sample | null;
  selectedSamplePhenotypes: PagedItems<Phenotype> | null;
  records: PagedItems<Record> | null;
};
