import initialState from '@/store/state'
import getters from '@/store/getters'
import {State} from "@/types/State";

test('samples returns empty array in case of no samples', () => {
    const testState: State = {...initialState}
    expect(getters.samples(testState)).toStrictEqual([])
})

test('samples returns array sorted by sample id', () => {
    const sample0 = {
        person: {
            individualId: 'personC'
        }
    }
    const sample1 = {
        person: {
            individualId: 'personA'
        }
    }
    const sample2 = {
        person: {
            individualId: 'personB'
        }
    }
    const testState: State = {...initialState, samples: {items: [sample2, sample0, sample1, sample2]}}
    expect(getters.samples(testState)).toStrictEqual([sample1, sample2, sample2, sample0])
})

test('get sample by id returns null in case of no samples', () => {
    const testState: State = {...initialState}
    expect(getters.getSampleById(testState)('MySampleId')).toBe(null)
})

test('get sample by id returns null in case of unknown sample', () => {
    const sample0 = {
        person: {
            individualId: 'MySampleId'
        }
    }
    const testState: State = {...initialState, samples: {items: [sample0]}}
    expect(getters.getSampleById(testState)('UnknownSampleId')).toBe(null)
})

test('get sample by id returns sample in case of known sample', () => {
    const sample0 = {
        person: {
            individualId: 'MySampleId'
        }
    }
    const testState: State = {...initialState, samples: {items: [sample0]}}
    expect(getters.getSampleById(testState)('MySampleId')).toBe(sample0)
})