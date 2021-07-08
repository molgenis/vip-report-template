import actions, { setTestApi } from '@/store/actions';
import { mock, when } from 'ts-mockito';
import { Api, ApiClient, Vcf } from '@molgenis/vip-report-api';
import { ActionContext, Commit } from 'vuex';
import { State } from '@/types/State';
import initialState from '@/store/state';

const api: ApiClient = mock(ApiClient);
setTestApi(api);

test('load metadata', async (done) => {
  const metadata = mock<Api.Metadata>();
  when(api.getMeta()).thenReturn(new Promise(() => metadata));

  const commit = jest.fn() as Commit;
  await actions.loadMetadata({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setMetadata', metadata);
  done();
});

test('load samples', async (done) => {
  const samples = mock<Api.PagedItems<Api.Sample>>();
  when(api.getSamples()).thenReturn(new Promise(() => samples));

  const commit = jest.fn() as Commit;
  await actions.loadSamples({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setSamples', samples);
  done();
});

test('load records without params', async (done) => {
  const records = mock<Api.PagedItems<Vcf.Record>>();
  when(api.getRecords()).thenReturn(new Promise(() => records));

  const commit = jest.fn() as Commit;
  await actions.loadRecords({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setRecords', records);
  done();
});

test('load records with params', async (done) => {
  const records = mock<Api.PagedItems<Vcf.Record>>();
  const params = {};
  when(api.getRecords(params)).thenReturn(new Promise(() => records));

  const commit = jest.fn() as Commit;
  await actions.loadRecords({ commit } as ActionContext<State, State>, params);
  expect(commit).toHaveBeenCalledWith('setRecords', records);
  done();
});

test('select record', async (done) => {
  const record = mock<Vcf.Record>();
  const commit = jest.fn() as Commit;
  actions.selectRecord({ commit } as ActionContext<State, State>, record);
  expect(commit).toHaveBeenCalledWith('setSelectedRecord', {});
  done();
});

test('select sample and load sample phenotypes', async (done) => {
  const phenotypes = mock<Api.PagedItems<Api.Phenotype>>();
  const sample: Api.Sample = {
    person: {
      familyId: 'MyFamilyId',
      individualId: 'personC',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'AFFECTED'
    },
    index: -1,
    proband: true
  };
  const params: Api.Params = {
    query: {
      selector: ['subject', 'id'],
      operator: '==',
      args: 'personC'
    }
  };
  when(api.getPhenotypes(params)).thenReturn(new Promise(() => phenotypes));

  const commit = jest.fn() as Commit;
  await actions.selectSample({ commit } as ActionContext<State, State>, sample);
  expect(commit).toHaveBeenCalledWith('setSelectedSample', sample);
  expect(commit).toHaveBeenCalledWith('setSelectedSamplePhenotypes', phenotypes);
  done();
});

test('enable annotations', async (done) => {
  const commit = jest.fn() as Commit;
  actions.enableAnnotations({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setAnnotations', {});
  done();
});

test('disable annotations', async (done) => {
  const commit = jest.fn() as Commit;
  actions.disableAnnotations({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setAnnotations', null);
  done();
});

test('import annotations', async (done) => {
  const annotations = {
    'sample0_1_2_A_C,CT': {
      sampleId: 'sample0',
      chr: '1',
      pos: 2,
      ref: 'A',
      alt: ['C', 'CT'],
      geneMatch: 'yes',
      class: 'LP',
      txt: 'my notes'
    }
  };
  const commit = jest.fn() as Commit;
  actions.importAnnotations({ commit } as ActionContext<State, State>, annotations);
  expect(commit).toHaveBeenCalledWith('setAnnotations', annotations);
  done();
});

test('upsert annotations', async (done) => {
  const annotation = {
    sampleId: 'sample0',
    chr: '1',
    pos: 2,
    ref: 'A',
    alt: ['C', 'CT'],
    geneMatch: 'yes',
    class: 'LP',
    txt: 'my notes'
  };
  const commit = jest.fn() as Commit;
  const testState: State = { ...initialState, annotations: {} };
  actions.upsertAnnotation({ state: testState, commit } as ActionContext<State, State>, annotation);
  expect(commit).toHaveBeenCalledWith('setAnnotations', { 'sample0_1_2_A_C,CT': annotation });
  done();
});

test('set filter records by phenotype', async (done) => {
  const commit = jest.fn() as Commit;
  actions.setFilterRecordsByPhenotype({ commit } as ActionContext<State, State>, true);
  expect(commit).toHaveBeenCalledWith('setFilterRecordsByPhenotype', true);
  done();
});

test('set filter records by inheritance', async (done) => {
  const commit = jest.fn() as Commit;
  actions.setFilterRecordsByInheritance({ commit } as ActionContext<State, State>, true);
  expect(commit).toHaveBeenCalledWith('setFilterRecordsByInheritance', true);
  done();
});

test('set filter records by denovo status', async (done) => {
  const commit = jest.fn() as Commit;
  actions.setFilterRecordsByDenovo({ commit } as ActionContext<State, State>, true);
  expect(commit).toHaveBeenCalledWith('setFilterRecordsByDenovo', true);
  done();
});

test('set filter records by read depth', async (done) => {
  const commit = jest.fn() as Commit;
  actions.setFilterRecordsByDepth({ commit } as ActionContext<State, State>, true);
  expect(commit).toHaveBeenCalledWith('setFilterRecordsByDepth', true);
  done();
});

test('get vcf gz', async (done) => {
  expect(await actions.getVcfGz()).not.toBe(null);
  done();
});

test('get fasta gz', async (done) => {
  const commit = jest.fn() as Commit;
  expect(await actions.getFastaGz({ commit } as ActionContext<State, State>, { contig: '1', pos: 17350500 })).not.toBe(
    null
  );
  done();
});

test('get genes gz', async (done) => {
  expect(await actions.getGenesGz()).not.toBe(null);
  done();
});

test('get bam', async (done) => {
  const commit = jest.fn() as Commit;
  expect(await actions.getBam({ commit } as ActionContext<State, State>, 'Patient')).not.toBe(null);
  done();
});

test('get decision tree gz', async (done) => {
  expect(await actions.getDecisionTreeGz()).not.toBe(null);
  done();
});
