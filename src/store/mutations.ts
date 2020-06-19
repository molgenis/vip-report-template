import {State} from '@/types/State'
import {Items, Metadata, Phenotype, Record, Sample} from '@molgenis/vip-report-api'
import {Alert} from '@/types/Alert'

export default {
    setMetadata(state: State, metadata: Metadata) {
        state.metadata = metadata
    },
    setSamples(state: State, samples: Items<Sample>) {
        state.samples = samples
    },
    setSelectedSample(state: State, sample: Sample) {
        state.selectedSample = sample
    },
    setSelectedSamplePhenotypes(state: State, phenotypes: Items<Phenotype>) {
        state.selectedSamplePhenotypes = phenotypes
    },
    setRecords(state: State, records: Items<Record>) {
        state.records = records
    },
    addAlert(state: State, alert: Alert) {
        const alerts = state.alerts.slice()
        alerts.push(alert)
        state.alerts = alerts
    },
    removeAlert(state: State, alert: Alert) {
        state.alerts = state.alerts.filter(anAlert => anAlert !== alert)
    }
}