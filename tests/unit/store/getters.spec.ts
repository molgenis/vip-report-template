import initialState from '@/store/state'
import getters from '@/store/getters'
import {State} from "@/types/State";
import {AffectedStatus, Sample, Sex} from "@/types/Sample";

test('samples returns empty array in case of no samples', () => {
    const testState: State = {...initialState}
    expect(getters.samples(testState)).toStrictEqual([])
})

test('samples returns array sorted by sample id', () => {
    const sample0: Sample = {
        person: {
            familyId: 'MyFamilyId',
            individualId: 'personC',
            paternalId: '0',
            maternalId: '0',
            sex: Sex.MALE,
            affectedStatus: AffectedStatus.AFFECTED
        },
        index: -1
    }
    const sample1: Sample = {
        person: {
            familyId: 'MyFamilyId',
            individualId: 'personA',
            paternalId: '0',
            maternalId: '0',
            sex: Sex.MALE,
            affectedStatus: AffectedStatus.AFFECTED
        },
        index: -1
    }
    const sample2: Sample = {
        person: {
            familyId: 'MyFamilyId',
            individualId: 'personB',
            paternalId: '0',
            maternalId: '0',
            sex: Sex.MALE,
            affectedStatus: AffectedStatus.AFFECTED
        },
        index: -1
    }
    const testState: State = {...initialState, samples: {items: [sample2, sample0, sample1, sample2], total: 4}}
    expect(getters.samples(testState)).toStrictEqual([sample1, sample2, sample2, sample0])
})

test('get sample by id returns null in case of no samples', () => {
    const testState: State = {...initialState}
    expect(getters.getSampleById(testState)('MySampleId')).toBe(null)
})

test('get sample by id returns null in case of unknown sample', () => {
    const sample0: Sample = {
        person: {
            familyId: 'MyFamilyId',
            individualId: 'MySampleId',
            paternalId: '0',
            maternalId: '0',
            sex: Sex.MALE,
            affectedStatus: AffectedStatus.AFFECTED
        },
        index: -1
    }
    const testState: State = {...initialState, samples: {items: [sample0], total: 1}}
    expect(getters.getSampleById(testState)('UnknownSampleId')).toBe(null)
})

test('get sample by id returns sample in case of known sample', () => {
    const sample0: Sample = {
        person: {
            familyId: 'MyFamilyId',
            individualId: 'MySampleId',
            paternalId: '0',
            maternalId: '0',
            sex: Sex.MALE,
            affectedStatus: AffectedStatus.AFFECTED
        },
        index: -1
    }
    const testState: State = {...initialState, samples: {items: [sample0], total: 1}}
    expect(getters.getSampleById(testState)('MySampleId')).toBe(sample0)
})