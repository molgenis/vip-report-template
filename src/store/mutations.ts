import {State} from '@/types/State'

export default {
    setMetadata(state: State, metadata: any) {
        state.metadata = metadata
    },
    setSamples(state: State, response: any) {
        state.samples = response
    },
    setSelectedSample(state: State, sample: any) {
        state.selectedSample = sample
    },
    setSelectedSamplePhenotypes(state: State, phenotypes: any) {
        state.selectedSamplePhenotypes = phenotypes
    },
    setRecords(state: State, response: any) {
        state.records = response
    }
}