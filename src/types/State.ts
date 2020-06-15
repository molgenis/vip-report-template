import {Items} from '@/types/Items'
import {Metadata} from '@/types/Metadata'
import {Sample} from '@/types/Sample'
import {Phenotype} from '@/types/Phenotype'
import {Record} from '@/types/Record'

export type State = {
    metadata: Metadata | null,
    samples: Items<Sample> | null,
    selectedSample: Sample | null,
    selectedSamplePhenotypes: Items<Phenotype> | null,
    records: Items<Record> | null
}