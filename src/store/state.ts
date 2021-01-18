import { State } from '@/types/State';

const state: State = {
  alerts: [],
  metadata: null,
  samples: null,
  selectedSample: null,
  selectedSamplePhenotypes: null,
  records: null,
  filterRecordsByPhenotype: true,
  filterRecordsByInheritance: false,
  filterRecordsByDenovo: false,
  isAllowLowPenetrance: false,
  annotations: null
};

export default state;
