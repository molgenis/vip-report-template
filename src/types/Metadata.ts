export interface AppMetadata {
    name: string
    version: string
    args: string
}

export interface HtsFileMetadata {
    htsFormat: string
    uri: string
    genomeAssembly: string
}

export enum InfoType {
    CHARACTER,
    INTEGER,
    FLAG,
    FLOAT,
    STRING
}

export enum NumberType {
    NUMBER,
    PER_ALT,
    PER_ALT_AND_REF,
    PER_GENOTYPE,
    OTHER
}

export interface InfoNumberMetadata {
    type: NumberType
    count?: number
}

export interface InfoMetadata {
    id: string
    number?: InfoNumberMetadata
    type: InfoType
    description: string
    source?: string
    version?: string
}

export interface RecordsMetadata {
    info: Array<InfoMetadata>
}

export interface Metadata {
    app: AppMetadata
    htsFile: HtsFileMetadata
    records: RecordsMetadata
}
