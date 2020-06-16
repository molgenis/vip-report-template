import Api, {Sample} from '@molgenis/vip-report-api'

// @ts-ignore
let api = new Api(window.api)

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

// testability
export function setTestApi(testApi: any) {
    api = testApi
}