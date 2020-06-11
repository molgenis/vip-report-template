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
    CHARACTER = "CHARACTER",
    INTEGER = "INTEGER",
    FLAG = "FLAG",
    FLOAT = "FLOAT",
    STRING = "STRING"
}

export enum NumberType {
    NUMBER = "NUMBER",
    PER_ALT = "PER_ALT",
    PER_ALT_AND_REF = "PER_ALT_AND_REF",
    PER_GENOTYPE = "PER_GENOTYPE",
    OTHER = "OTHER"
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
