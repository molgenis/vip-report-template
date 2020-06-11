import {State} from '@/types/State'

export default {
    samples: (state: State): any => {
        if(state.samples === null) {
            return []
        }

        const items = state.samples.items.slice()
        return items.sort(function (thisSample: any, thatSample: any) {
            if (thisSample.person.individualId < thatSample.person.individualId) {
                return -1;
            }
            if (thisSample.person.individualId > thatSample.person.individualId) {
                return 1;
            }
            return 0;
        });
    },
    getSampleById: (state: State) => (id: string) => {
        return state.samples.items.find((sample: any) => sample.person.individualId === id)
    }
}