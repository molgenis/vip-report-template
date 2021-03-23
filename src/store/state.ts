import { State } from '@/types/State';

const state: State = {
  alerts: [],
  metadata: null,
  samples: null,
  selectedSample: null,
  selectedSamplePhenotypes: null,
  records: null,
  selectedRecord: null,
  filterRecordsByPhenotype: true,
  filterRecordsByInheritance: true,
  filterRecordsByDenovo: false,
  filterRecordsByDepth: false,
  annotations: null
};

export default state;
