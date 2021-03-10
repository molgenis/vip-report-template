import Api, { ApiData, Params, Sample } from '@molgenis/vip-report-api';
import { Alert } from '@/types/Alert';
import { ActionContext } from 'vuex';
import { State } from '@/types/State';
import { apiData } from '@/mocks/apiDataMock';
import { Annotation, Annotations } from '@/types/Annotations';

declare global {
  interface Window {
    api: ApiData;
  }
}

const inputData = process.env.NODE_ENV === 'development' ? apiData : window.api;
let api = new Api(inputData);

export default {
  async loadMetadata({ commit }: ActionContext<State, State>): Promise<void> {
    const response = await api.getMeta();
    commit('setMetadata', response);
  },
  async validateSamples({ commit }: ActionContext<State, State>): Promise<void> {
    const params: Params = { size: 0 };
    const response = await api.get('samples', params);
    if (response.total > response.page.totalElements) {
      commit('addAlert', {
        type: 'warning',
        messageId: 'sampleWarning',
        messageArgs: [response.page.totalElements, response.total]
      });
    }
  },
  async loadSamples({ commit }: ActionContext<State, State>): Promise<void> {
    const params: Params = { size: Number.MAX_VALUE };
    const response = await api.get('samples', params);
    commit('setSamples', response);
  },
  async selectSample({ commit }: ActionContext<State, State>, sample: Sample): Promise<void> {
    const response = await api.get('phenotypes', {
      query: {
        selector: ['subject', 'id'],
        operator: '==',
        args: sample.person.individualId
      }
    });

    commit('setSelectedSample', sample);
    commit('setSelectedSamplePhenotypes', response);
  },
  async validateRecords({ commit }: ActionContext<State, State>): Promise<void> {
    const response = await api.get('records', { size: 0 });
    if (response.total > response.page.totalElements) {
      commit('addAlert', {
        type: 'warning',
        messageId: 'recordWarning',
        messageArgs: [response.page.totalElements, response.total]
      });
    }
  },
  async loadRecords({ commit }: ActionContext<State, State>, params?: Params): Promise<void> {
    const response = await api.get('records', params);
    commit('setRecords', response);
  },
  removeAlert({ commit }: ActionContext<State, State>, alert: Alert): void {
    commit('removeAlert', alert);
  },
  enableAnnotations({ commit }: ActionContext<State, State>): void {
    commit('setAnnotations', {});
  },
  disableAnnotations({ commit }: ActionContext<State, State>): void {
    commit('setAnnotations', null);
  },
  importAnnotations({ commit }: ActionContext<State, State>, annotations: Annotations): void {
    commit('setAnnotations', annotations);
  },
  upsertAnnotation({ commit, state }: ActionContext<State, State>, annotation: Annotation): void {
    const annotations = Object.assign({}, state.annotations);
    const key = `${annotation.sampleId}_${annotation.chr}_${annotation.pos}_${annotation.ref}_${annotation.alt.join(
      ','
    )}`;
    annotations[key] = annotation;
    commit('setAnnotations', annotations);
  },
  setFilterRecordsByPhenotype({ commit }: ActionContext<State, State>, value: boolean): void {
    commit('setFilterRecordsByPhenotype', value);
  },
  setFilterRecordsByInheritance({ commit }: ActionContext<State, State>, value: boolean): void {
    commit('setFilterRecordsByInheritance', value);
  },
  setFilterRecordsByDenovo({ commit }: ActionContext<State, State>, value: boolean): void {
    commit('setFilterRecordsByDenovo', value);
  },
  setFilterRecordsByDepth({ commit }: ActionContext<State, State>, value: boolean): void {
    commit('setFilterRecordsByDepth', value);
  }
};

// testability
export function setTestApi(testApi: Api): void {
  api = testApi;
}
