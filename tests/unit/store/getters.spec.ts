import initialState from '@/store/state'
import getters from '@/store/getters'
import {State} from '@/types/State'
import {GenomeBrowserDb} from '@/types/GenomeBrowserDb'
import {mock} from 'ts-mockito'
import {HtsFileMetadata, Metadata, Sample} from '@molgenis/vip-report-api'
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
            sex: 'MALE',
            affectedStatus: 'AFFECTED'
        },
        index: -1
    }
    const sample1: Sample = {
        person: {
            familyId: 'MyFamilyId',
            individualId: 'personA',
            paternalId: '0',
            maternalId: '0',
            sex: 'MALE',
            affectedStatus: 'AFFECTED'
        },
        index: -1
    }
    const sample2: Sample = {
        person: {
            familyId: 'MyFamilyId',
            individualId: 'personB',
            paternalId: '0',
            maternalId: '0',
            sex: 'MALE',
            affectedStatus: 'AFFECTED'
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
            sex: 'MALE',
            affectedStatus: 'AFFECTED'
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
            sex: 'MALE',
            affectedStatus: 'AFFECTED'
        },
        index: -1
    }
    const testState: State = {...initialState, samples: {items: [sample0], total: 1}}
    expect(getters.getSampleById(testState)('MySampleId')).toBe(sample0)
})

test('get genomeBrowserDb for NCBI34 assembly', () => {
    const metadata = mock<Metadata>()
    metadata.htsFile = mock<HtsFileMetadata>()
    metadata.htsFile.genomeAssembly = 'NCBI34'

    const testState: State = {...initialState, metadata: metadata}
    expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg16)
})

test('get genomeBrowserDb for NCBI35 assembly', () => {
    const metadata = mock<Metadata>()
    metadata.htsFile = mock<HtsFileMetadata>()
    metadata.htsFile.genomeAssembly = 'NCBI35'

    const testState: State = {...initialState, metadata: metadata}
    expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg17)
})

test('get genomeBrowserDb for NCBI36 assembly', () => {
    const metadata = mock<Metadata>()
    metadata.htsFile = mock<HtsFileMetadata>()
    metadata.htsFile.genomeAssembly = 'NCBI36'

    const testState: State = {...initialState, metadata: metadata}
    expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg18)
})

test('get genomeBrowserDb for GRCh37 assembly', () => {
    const metadata = mock<Metadata>()
    metadata.htsFile = mock<HtsFileMetadata>()
    metadata.htsFile.genomeAssembly = 'GRCh37'

    const testState: State = {...initialState, metadata: metadata}
    expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg19)
})

test('get genomeBrowserDb for GRCh38 assembly', () => {
    const metadata = mock<Metadata>()
    metadata.htsFile = mock<HtsFileMetadata>()
    metadata.htsFile.genomeAssembly = 'GRCh38'

    const testState: State = {...initialState, metadata: metadata}
    expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg38)
})

test('get genomeBrowserDb for UNKNOWN assembly', () => {
    const metadata = mock<Metadata>()
    metadata.htsFile = mock<HtsFileMetadata>()
    metadata.htsFile.genomeAssembly = 'UNKNOWN'

    const testState: State = {...initialState, metadata: metadata}
    expect(getters.genomeBrowserDb(testState)).toBe(null)
})

test('get genomeBrowserDb when no metadata available', () => {
    const testState: State = {...initialState}
    expect(getters.genomeBrowserDb(testState)).toBe(null)
})