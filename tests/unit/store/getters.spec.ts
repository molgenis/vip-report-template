import initialState from '@/store/state'
import getters from '@/store/getters'
import {State} from '@/types/State'
import {GenomeBrowserDb} from '@/types/GenomeBrowserDb'
import {mock} from 'ts-mockito'
import {HtsFileMetadata, Items, Metadata, Person, Sample} from '@molgenis/vip-report-api'

test('samples returns empty array in case of no samples', () => {
    const testState: State = {...initialState}
    expect(getters.samples(testState)).toStrictEqual([])
})

test('samples returns array sorted by sample id', () => {
    const person0: Person = mock<Person>()
    person0.individualId = 'personC'
    const sample0: Sample = mock<Sample>()
    sample0.person = person0
    const person1: Person = mock<Person>()
    person1.individualId = 'personA'
    const sample1: Sample = mock<Sample>()
    sample1.person = person1
    const person2: Person = mock<Person>()
    person2.individualId = 'personB'
    const sample2: Sample = mock<Sample>()
    sample2.person = person2

    const samples: Items<Sample> = mock<Items<Sample>>()
    samples.items = [sample2, sample0, sample1, sample2]

    const testState: State = {...initialState, samples}
    expect(getters.samples(testState).map(sample => sample.person.individualId)).toEqual(['personA', 'personB', 'personB', 'personC'])
})

test('get sample by id returns null in case of no samples', () => {
    const testState: State = {...initialState}
    expect(getters.getSampleById(testState)('MySampleId')).toBe(null)
})

test('get sample by id returns null in case of unknown sample', () => {
    const person0: Person = mock<Person>()
    person0.individualId = 'MySampleId'
    const sample0: Sample = mock<Sample>()
    sample0.person = person0

    const samples: Items<Sample> = mock<Items<Sample>>()
    samples.items = [sample0]

    const testState: State = {...initialState, samples}
    expect(getters.getSampleById(testState)('UnknownSampleId')).toBe(null)
})

test('get sample by id returns sample in case of known sample', () => {
    const person0: Person = mock<Person>()
    person0.individualId = 'MySampleId'
    const sample0: Sample = mock<Sample>()
    sample0.person = person0

    const samples: Items<Sample> = mock<Items<Sample>>()
    samples.items = [sample0]

    const testState: State = {...initialState, samples}
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