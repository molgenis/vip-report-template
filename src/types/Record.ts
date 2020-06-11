export enum GenotypeType {
    het = 'het',
    hom_a = 'hom_a',
    hom_r = 'hom_r',
    miss = 'miss',
    part = 'part'
}

export interface Genotype {
    a?: Array<string>
    p: boolean,
    t: GenotypeType
}

export interface RecordSample {
    gt: Genotype
}

export interface Record {
    c: string
    p: number
    i?: Array<string>
    r: string,
    a: Array<string>
    q?: number
    f?: Array<string>
    n?: Object
    s?: Array<RecordSample>
}