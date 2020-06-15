import {Items, Metadata, Phenotype, Record, Sample} from '@molgenis/vip-report-api'

export type State = {
    metadata: Metadata | null,
    samples: Items<Sample> | null,
    selectedSample: Sample | null,
    selectedSamplePhenotypes: Items<Phenotype> | null,
    records: Items<Record> | null
}