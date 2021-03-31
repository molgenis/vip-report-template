import initialState from '@/store/state';
import mutations from '@/store/mutations';
import { State } from '@/types/State';
import { mock } from 'ts-mockito';
import { Api, Vcf } from '@molgenis/vip-report-api';
import { Annotations } from '@/types/Annotations';

test('set metadata', () => {
  const testState: State = { ...initialState };
  const metadata: Api.Metadata = mock<Api.Metadata>();
  mutations.setMetadata(testState, metadata);
  expect(testState.metadata).toBe(metadata);
});

test('set samples', () => {
  const testState: State = { ...initialState };
  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  mutations.setSamples(testState, samples);
  expect(testState.samples).toBe(samples);
});

test('set selected sample', () => {
  const testState: State = { ...initialState };
  const sample: Api.Sample = mock<Api.Sample>();
  mutations.setSelectedSample(testState, sample);
  expect(testState.selectedSample).toBe(sample);
  expect(testState.selectedRecord).toBe(null);
});

test('set selected sample phenotypes', () => {
  const testState: State = { ...initialState };
  const phenotypes: Api.PagedItems<Api.Phenotype> = mock<Api.PagedItems<Api.Phenotype>>();
  mutations.setSelectedSamplePhenotypes(testState, phenotypes);
  expect(testState.selectedSamplePhenotypes).toBe(phenotypes);
});

test('set records', () => {
  const testState: State = { ...initialState };
  const records: Api.PagedItems<Vcf.Record> = mock<Api.PagedItems<Vcf.Record>>();
  mutations.setRecords(testState, records);
  expect(testState.records).toBe(records);
});

test('set selected record', () => {
  const testState: State = { ...initialState };
  const record: Vcf.Record = mock<Vcf.Record>();
  mutations.setSelectedRecord(testState, record);
  expect(testState.selectedRecord).toBe(record);
});

test('set annotations', () => {
  const testState: State = { ...initialState };
  const annotations: Annotations = mock<Annotations>();
  mutations.setAnnotations(testState, annotations);
  expect(testState.annotations).toBe(annotations);
});

test('set filter records by phenotype', () => {
  const testState: State = { ...initialState };
  mutations.setFilterRecordsByPhenotype(testState, false);
  expect(testState.filterRecordsByPhenotype).toBe(false);
});

test('set filter records by inheritance', () => {
  const testState: State = { ...initialState };
  mutations.setFilterRecordsByInheritance(testState, false);
  expect(testState.filterRecordsByInheritance).toBe(false);
});

test('set filter records by denovo', () => {
  const testState: State = { ...initialState };
  mutations.setFilterRecordsByDenovo(testState, false);
  expect(testState.filterRecordsByDenovo).toBe(false);
});

test('set filter records by read depth', () => {
  const testState: State = { ...initialState };
  mutations.setFilterRecordsByDepth(testState, false);
  expect(testState.filterRecordsByDepth).toBe(false);
});
