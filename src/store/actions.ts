import Api, { Params, Sample } from "@molgenis/vip-report-api";
import { Alert } from "@/types/Alert";

// @ts-ignore
let api = new Api(window.api);

export default {
  async loadMetadata({ commit }: any) {
    const response = await api.getMeta();
    commit("setMetadata", response);
  },
  async validateSamples({ commit }: any) {
    const params: Params = { size: 0 };
    const response = await api.get("samples", params);
    if (response.total > response.page.totalElements) {
      commit("addAlert", {
        type: "warning",
        messageId: "sampleWarning",
        messageArgs: [response.page.totalElements, response.total]
      });
    }
  },
  async loadSamples({ commit }: any) {
    const params: Params = { size: Number.MAX_VALUE };
    const response = await api.get("samples", params);
    commit("setSamples", response);
  },
  async selectSample({ commit }: any, sample: Sample) {
    const response = await api.get("phenotypes", {
      query: {
        selector: ["subject", "id"],
        operator: "==",
        args: sample.person.individualId
      }
    });

    commit("setSelectedSample", sample);
    commit("setSelectedSamplePhenotypes", response);
  },
  async validateRecords({ commit }: any) {
    const response = await api.get("records", { size: 0 });
    if (response.total > response.page.totalElements) {
      commit("addAlert", {
        type: "warning",
        messageId: "recordWarning",
        messageArgs: [response.page.totalElements, response.total]
      });
    }
  },
  async loadRecords({ commit, state }: any, params?: Params) {
    const response = await api.get("records", params);
    commit("setRecords", response);
  },
  removeAlert({ commit }: any, alert: Alert) {
    commit("removeAlert", alert);
  }
};

// testability
export function setTestApi(testApi: any) {
  api = testApi;
}
