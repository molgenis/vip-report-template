import { Metadata, PagedItems, Phenotype, Record, Sample } from '@molgenis/vip-report-api';
import { Alert } from '@/types/Alert';
import { Annotations } from '@/types/Annotations';

export type State = {
  alerts: Array<Alert>;
  metadata: Metadata | null;
  samples: PagedItems<Sample> | null;
  selectedSample: Sample | null;
  selectedSamplePhenotypes: PagedItems<Phenotype> | null;
  records: PagedItems<Record> | null;
  filterRecordsByPhenotype: boolean;
  filterRecordsByInheritance: boolean;
  filterRecordsByDenovo: boolean;
  annotations: Annotations | null;
};
