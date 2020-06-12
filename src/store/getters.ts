import {State} from '@/types/State'
import {Sample} from "@/types/Sample";

export default {
    samples: (state: State): Array<Sample> => {
        if(state.samples === null) {
            return []
        }

        const items = state.samples.items.slice()
        return items.sort(function (thisSample, thatSample) {
            if (thisSample.person.individualId < thatSample.person.individualId) {
                return -1;
            }
            if (thisSample.person.individualId > thatSample.person.individualId) {
                return 1;
            }
            return 0;
        });
    },
    getSampleById: (state: State) => (id: string): Sample | null => {
        if(state.samples === null) {
            return null
        }
        return state.samples.items.find(sample => sample.person.individualId === id) || null
    }
}