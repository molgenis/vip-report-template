import { Api, Vcf } from '@molgenis/vip-report-api';
import { Alert } from '@/types/Alert';
import { Annotations } from '@/types/Annotations';

export type State = {
  alerts: Array<Alert>;
  metadata: Api.Metadata | null;
  samples: Api.PagedItems<Api.Sample> | null;
  selectedSample: Api.Sample | null;
  selectedSamplePhenotypes: Api.PagedItems<Api.Phenotype> | null;
  records: Api.PagedItems<Vcf.Record> | null;
  selectedRecord: Vcf.Record | null;
  filterRecordsByPhenotype: boolean;
  filterRecordsByInheritance: boolean;
  filterRecordsByDenovo: boolean;
  filterRecordsByDepth: boolean;
  annotations: Annotations | null;
};
