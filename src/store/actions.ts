import Api, { ApiData, Params, Sample } from '@molgenis/vip-report-api';
import { Alert } from '@/types/Alert';
import { ActionContext } from 'vuex';
import { State } from '@/types/State';

declare global {
  interface Window {
    api: ApiData;
  }
}

let api = new Api(window.api);

export default {
  async loadMetadata({ commit }: ActionContext<State, State>) {
    const response = await api.getMeta();
    commit('setMetadata', response);
  },
  async validateSamples({ commit }: ActionContext<State, State>) {
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
  async loadSamples({ commit }: ActionContext<State, State>) {
    const params: Params = { size: Number.MAX_VALUE };
    const response = await api.get('samples', params);
    commit('setSamples', response);
  },
  async selectSample({ commit }: ActionContext<State, State>, sample: Sample) {
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
  async validateRecords({ commit }: ActionContext<State, State>) {
    const response = await api.get('records', { size: 0 });
    if (response.total > response.page.totalElements) {
      commit('addAlert', {
        type: 'warning',
        messageId: 'recordWarning',
        messageArgs: [response.page.totalElements, response.total]
      });
    }
  },
  async loadRecords({ commit }: ActionContext<State, State>, params?: Params) {
    const response = await api.get('records', params);
    commit('setRecords', response);
  },
  removeAlert({ commit }: ActionContext<State, State>, alert: Alert) {
    commit('removeAlert', alert);
  }
};

// testability
export function setTestApi(testApi: Api) {
  api = testApi;
}
