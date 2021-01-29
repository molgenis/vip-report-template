import initialState from '@/store/state';
import mutations from '@/store/mutations';
import { State } from '@/types/State';
import { mock } from 'ts-mockito';
import { Metadata, PagedItems, Phenotype, Record, Sample } from '@molgenis/vip-report-api';
import { Annotations } from '@/types/Annotations';

test('set metadata', () => {
  const testState: State = { ...initialState };
  const metadata: Metadata = mock<Metadata>();
  mutations.setMetadata(testState, metadata);
  expect(testState.metadata).toBe(metadata);
});

test('set samples', () => {
  const testState: State = { ...initialState };
  const samples: PagedItems<Sample> = mock<PagedItems<Sample>>();
  mutations.setSamples(testState, samples);
  expect(testState.samples).toBe(samples);
});

test('set selected sample', () => {
  const testState: State = { ...initialState };
  const sample: Sample = mock<Sample>();
  mutations.setSelectedSample(testState, sample);
  expect(testState.selectedSample).toBe(sample);
});

test('set selected sample phenotypes', () => {
  const testState: State = { ...initialState };
  const phenotypes: PagedItems<Phenotype> = mock<PagedItems<Phenotype>>();
  mutations.setSelectedSamplePhenotypes(testState, phenotypes);
  expect(testState.selectedSamplePhenotypes).toBe(phenotypes);
});

test('set records', () => {
  const testState: State = { ...initialState };
  const records: PagedItems<Record> = mock<PagedItems<Record>>();
  mutations.setRecords(testState, records);
  expect(testState.records).toBe(records);
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
