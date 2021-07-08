import { Alert } from '@/types/Alert';
import { ActionContext } from 'vuex';
import { State } from '@/types/State';
import { apiData } from '@/mocks/apiDataMock';
import { Annotation, Annotations } from '@/types/Annotations';
import { Api, ApiClient, ApiData, Vcf } from '@molgenis/vip-report-api';

declare global {
  interface Window {
    api: ApiData.Container;
  }
}

const inputData = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? apiData : window.api;
let api: ApiClient = new ApiClient(inputData);

export type Locus = {
  contig: string;
  pos: number;
};

export default {
  async loadMetadata({ commit }: ActionContext<State, State>): Promise<void> {
    const response = await api.getMeta();
    commit('setMetadata', response);
  },
  async validateSamples({ commit }: ActionContext<State, State>): Promise<void> {
    const params: Api.Params = { size: 0 };
    const response = await api.getSamples(params);
    if (response.total > response.page.totalElements) {
      commit('addAlert', {
        type: 'warning',
        messageId: 'sampleWarning',
        messageArgs: [response.page.totalElements, response.total]
      });
    }
  },
  async loadSamples({ commit }: ActionContext<State, State>): Promise<void> {
    const params: Api.Params = { size: Number.MAX_VALUE };
    const response = await api.getSamples(params);
    commit('setSamples', response);
  },
  async selectSample({ commit }: ActionContext<State, State>, sample: Api.Sample): Promise<void> {
    const response = await api.getPhenotypes({
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
    const response = await api.getRecords({ size: 0 });
    if (response.total > response.page.totalElements) {
      commit('addAlert', {
        type: 'warning',
        messageId: 'recordWarning',
        messageArgs: [response.page.totalElements, response.total]
      });
    }
  },
  async loadRecords({ commit }: ActionContext<State, State>, params?: Api.Params): Promise<void> {
    const response = await api.getRecords(params);
    commit('setRecords', response);
  },
  selectRecord({ commit }: ActionContext<State, State>, record: Vcf.Record): void {
    commit('setSelectedRecord', record);
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
  },
  getVcfGz(): Promise<Buffer> {
    return api.getVcfGz();
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFastaGz({ commit }: ActionContext<State, State>, locus: Locus): Promise<Buffer | null> {
    return api.getFastaGz(locus.contig, locus.pos);
  },
  getGenesGz(): Promise<Buffer | null> {
    return api.getGenesGz();
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBam({ commit }: ActionContext<State, State>, sampleId: string): Promise<Buffer | null> {
    return api.getBam(sampleId);
  },
  getDecisionTreeGz(): Promise<Buffer | null> {
    return api.getDecisionTreeGz();
  }
};

// testability
export function setTestApi(testApi: ApiClient): void {
  api = testApi;
}
