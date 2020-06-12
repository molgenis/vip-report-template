import initialState from '@/store/state'
import mutations from '@/store/mutations'
import {State} from "@/types/State";
import {Metadata} from "@/types/Metadata";
import {mock} from "ts-mockito";
import {Record} from "@/types/Record";
import {Sample} from "@/types/Sample";
import {Items} from "@/types/Items";
import {Phenotype} from "@/types/Phenotype";

test('set metadata', () => {
    const testState: State = { ...initialState }
    const metadata: Metadata = mock<Metadata>();
    mutations.setMetadata(testState, metadata)
    expect(testState.metadata).toBe(metadata)
})

test('set samples', () => {
    const testState: State = { ...initialState }
    const samples: Items<Sample> = mock<Items<Sample>>();
    mutations.setSamples(testState, samples)
    expect(testState.samples).toBe(samples)
})

test('set selected sample', () => {
    const testState: State = { ...initialState }
    const sample: Sample = mock<Sample>();
    mutations.setSelectedSample(testState, sample)
    expect(testState.selectedSample).toBe(sample)
})

test('set selected sample phenotypes', () => {
    const testState: State = { ...initialState }
    const phenotypes: Items<Phenotype> = mock<Items<Phenotype>>();
    mutations.setSelectedSamplePhenotypes(testState, phenotypes)
    expect(testState.selectedSamplePhenotypes).toBe(phenotypes)
})

test('set records', () => {
    const testState: State = { ...initialState }
    const records: Items<Record> = mock<Items<Record>>();
    mutations.setRecords(testState, records)
    expect(testState.records).toBe(records)
})