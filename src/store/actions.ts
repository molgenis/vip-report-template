import Api from "@molgenis/vip-report-api";
import {Sample} from "@/types/Sample";

declare global {
    interface Window {
        api: any;
    }
}

const api = new Api(window.api)

export default {
    async loadMetadata({commit}: any) {
        const response = await api.getMeta()
        commit('setMetadata', response)
    },
    async loadSamples({commit}: any) {
        const response = await api.get('samples')
        commit('setSamples', response)
    },
    async selectSample({commit}: any, sample: Sample) {
        const response = await api.get('phenotypes', {
            query: {
                selector: ['subject', 'id'],
                operator: '==',
                args: sample.person.individualId
            }
        })

        commit('setSelectedSample', sample)
        commit('setSelectedSamplePhenotypes', response)
    },
    async loadRecords({commit}: any, params: any) {
        const response = await api.get('records', params)
        commit('setRecords', response)
    },
}