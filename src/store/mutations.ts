import { State } from '@/types/State';
import { Api, Vcf } from '@molgenis/vip-report-api';
import { Alert } from '@/types/Alert';
import { Annotations } from '@/types/Annotations';

export default {
  setMetadata(state: State, metadata: Api.Metadata): void {
    state.metadata = metadata;
  },
  setSamples(state: State, samples: Api.PagedItems<Api.Sample>): void {
    state.samples = samples;
  },
  setSelectedSample(state: State, sample: Api.Sample): void {
    state.selectedSample = sample;
    state.selectedRecord = null;
  },
  setSelectedSamplePhenotypes(state: State, phenotypes: Api.PagedItems<Api.Phenotype>): void {
    state.selectedSamplePhenotypes = phenotypes;
  },
  setRecords(state: State, records: Api.PagedItems<Vcf.Record>): void {
    state.records = records;
    state.selectedRecord = null;
  },
  setSelectedRecord(state: State, record: Vcf.Record): void {
    state.selectedRecord = record;
  },
  addAlert(state: State, alert: Alert): void {
    const alerts = state.alerts.slice();
    alerts.push(alert);
    state.alerts = alerts;
  },
  removeAlert(state: State, alert: Alert): void {
    state.alerts = state.alerts.filter((anAlert) => anAlert !== alert);
  },
  setAnnotations(state: State, annotations: Annotations): void {
    state.annotations = annotations;
  },
  setFilterRecordsByPhenotype(state: State, value: boolean): void {
    state.filterRecordsByPhenotype = value;
  },
  setFilterRecordsByInheritance(state: State, value: boolean): void {
    state.filterRecordsByInheritance = value;
  },
  setFilterRecordsByDenovo(state: State, value: boolean): void {
    state.filterRecordsByDenovo = value;
  },
  setFilterRecordsByDepth(state: State, value: boolean): void {
    state.filterRecordsByDepth = value;
  }
};
