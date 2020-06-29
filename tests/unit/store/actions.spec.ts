import actions, { setTestApi } from '@/store/actions';
import { mock, when } from 'ts-mockito';
import Api, { Metadata, PagedItems, Params, Phenotype, Record, Sample } from '@molgenis/vip-report-api';
import {ActionContext, Commit} from 'vuex'
import {State} from '@/types/State'

const api: Api = mock(Api);
setTestApi(mock(Api));

test('load metadata', async done => {
  const metadata = mock<Metadata>();
  when(api.getMeta()).thenReturn(new Promise(() => metadata));

  const commit = jest.fn() as Commit;
  await actions.loadMetadata({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setMetadata', metadata);
  done();
});

test('load samples', async done => {
  const samples = mock<PagedItems<Sample>>();
  when(api.get('samples')).thenReturn(new Promise(() => samples));

  const commit = jest.fn() as Commit;
  await actions.loadSamples({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setSamples', samples);
  done();
});

test('load records without params', async done => {
  const records = mock<PagedItems<Record>>();
  when(api.get('records')).thenReturn(new Promise(() => records));

  const commit = jest.fn() as Commit;
  await actions.loadRecords({ commit } as ActionContext<State, State>);
  expect(commit).toHaveBeenCalledWith('setRecords', records);
  done();
});

test('load records with params', async done => {
  const records = mock<PagedItems<Record>>();
  const params = {};
  when(api.get('records', params)).thenReturn(new Promise(() => records));

  const commit = jest.fn() as Commit;
  await actions.loadRecords({ commit } as ActionContext<State, State>, params);
  expect(commit).toHaveBeenCalledWith('setRecords', records);
  done();
});

test('select sample and load sample phenotypes', async done => {
  const phenotypes = mock<PagedItems<Phenotype>>();
  const sample: Sample = {
    person: {
      familyId: 'MyFamilyId',
      individualId: 'personC',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'AFFECTED'
    },
    index: -1
  };
  const params: Params = {
    query: {
      selector: ['subject', 'id'],
      operator: '==',
      args: 'personC'
    }
  };
  when(api.get('phenotypes', params)).thenReturn(new Promise(() => phenotypes));

  const commit = jest.fn() as Commit;
  await actions.selectSample({ commit } as ActionContext<State, State>, sample);
  expect(commit).toHaveBeenCalledWith('setSelectedSample', sample);
  expect(commit).toHaveBeenCalledWith('setSelectedSamplePhenotypes', phenotypes);
  done();
});
