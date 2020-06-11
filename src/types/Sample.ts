export enum Sex {
    UNKNOWN_SEX = 'UNKNOWN_SEX',
    FEMALE = 'FEMALE',
    MALE = 'MALE',
    OTHER_SEX = 'OTHER_SEX'
}

export enum AffectedStatus {
    MISSING = 'MISSING',
    UNAFFECTED = 'UNAFFECTED',
    AFFECTED = 'AFFECTED'
}

export interface Person {
    familyId: string
    individualId: string
    paternalId: string
    maternalId: string
    sex: Sex
    affectedStatus: AffectedStatus
}

export interface Sample {
    person: Person
    index: number
}