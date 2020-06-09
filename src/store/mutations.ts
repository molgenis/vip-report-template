import {State} from '@/types/State'

export default {
    setMetadata(state: State, metadata: any) {
        state.metadata = metadata
    },
    setSamples(state: State, response: any) {
        state.samples = response
    }
}