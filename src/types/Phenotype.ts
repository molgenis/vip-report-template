export interface PhenotypeSubject {
    id: string
}

export interface OntologyClass {
    id: string,
    label: string
}

export interface PhenotypicFeature {
    type: OntologyClass
}

export interface Phenotype {
    subject: PhenotypeSubject
    phenotypicFeaturesList: Array<PhenotypicFeature>
}