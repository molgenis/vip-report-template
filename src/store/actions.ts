import Api from "@molgenis/vip-report-api";

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
    }
}