import {Items, Metadata, Phenotype, Record, Sample} from '@molgenis/vip-report-api'
import {Alert} from '@/types/Alert'

export type State = {
    alerts: Array<Alert>
    metadata: Metadata | null,
    samples: Items<Sample> | null,
    selectedSample: Sample | null,
    selectedSamplePhenotypes: Items<Phenotype> | null,
    records: Items<Record> | null
}