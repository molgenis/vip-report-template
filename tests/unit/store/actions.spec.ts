import actions, {setTestApi} from '@/store/actions'
import {mock, when} from 'ts-mockito'
import Api, {Metadata, PagedItems, Params, Phenotype, Record, Sample} from '@molgenis/vip-report-api'

const api: Api = mock(Api)
setTestApi(mock(Api))

test('load metadata', async (done) => {
    const metadata = mock<Metadata>()
    when(api.getMeta()).thenReturn(new Promise(() => metadata))

    const commit = jest.fn()
    await actions.loadMetadata({commit})
    expect(commit).toHaveBeenCalledWith('setMetadata', metadata)
    done()
})

test('load samples', async (done) => {
    const samples = mock<PagedItems<Sample>>()
    when(api.get('samples')).thenReturn(new Promise(() => samples))

    const commit = jest.fn()
    await actions.loadSamples({commit})
    expect(commit).toHaveBeenCalledWith('setSamples', samples)
    done()
})

test('load records without params', async (done) => {
    const records = mock<PagedItems<Record>>()
    when(api.get('records')).thenReturn(new Promise(() => records))

    const commit = jest.fn()
    await actions.loadRecords({commit})
    expect(commit).toHaveBeenCalledWith('setRecords', records)
    done()
})

test('load records with params', async (done) => {
    const records = mock<PagedItems<Record>>()
    const params = {}
    when(api.get('records', params)).thenReturn(new Promise(() => records))

    const commit = jest.fn()
    await actions.loadRecords({commit}, params)
    expect(commit).toHaveBeenCalledWith('setRecords', records)
    done()
})

test('select sample and load sample phenotypes', async (done) => {
    const phenotypes = mock<PagedItems<Phenotype>>()
    const sample: Sample = {
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
    const params:Params = {
        query: {
            selector: ['subject', 'id'],
            operator: '==',
            args: 'personC'
        }
    }
    when(api.get('phenotypes', params)).thenReturn(new Promise(() => phenotypes))

    const commit = jest.fn()
    await actions.selectSample({commit}, sample)
    expect(commit).toHaveBeenCalledWith('setSelectedSample', sample)
    expect(commit).toHaveBeenCalledWith('setSelectedSamplePhenotypes', phenotypes)
    done()
})