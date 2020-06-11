import initialState from '@/store/state'
import mutations from '@/store/mutations'
import {State} from "@/types/State";

test('set metadata', () => {
    const testState: State = { ...initialState }
    const metadata = {}
    mutations.setMetadata(testState, metadata)
    expect(testState.metadata).toBe(metadata)
})

test('set samples', () => {
    const testState: State = { ...initialState }
    const samples = {}
    mutations.setSamples(testState, samples)
    expect(testState.samples).toBe(samples)
})

test('set selected sample', () => {
    const testState: State = { ...initialState }
    const sample = {}
    mutations.setSelectedSample(testState, sample)
    expect(testState.selectedSample).toBe(sample)
})

test('set selected sample phenotypes', () => {
    const testState: State = { ...initialState }
    const phenotypes = {}
    mutations.setSelectedSamplePhenotypes(testState, phenotypes)
    expect(testState.selectedSamplePhenotypes).toBe(phenotypes)
})

test('set records', () => {
    const testState: State = { ...initialState }
    const records = {}
    mutations.setRecords(testState, records)
    expect(testState.records).toBe(records)
})