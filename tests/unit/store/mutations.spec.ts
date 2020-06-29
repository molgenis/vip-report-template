import initialState from '@/store/state';
import mutations from '@/store/mutations';
import { State } from '@/types/State';
import { mock } from 'ts-mockito';
import { Metadata, PagedItems, Phenotype, Record, Sample } from '@molgenis/vip-report-api';

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
