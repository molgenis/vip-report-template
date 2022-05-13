// this is .ts instead of .d.ts file to work around https://github.com/TypeStrong/ts-loader/issues/1036
import { Metadata as RecordMetadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { DecisionTree } from "./DecisionTree";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export interface Api {
  getRecordsMeta(): Promise<RecordMetadata>;
  getRecords(params: Params): Promise<PagedItems<Record>>;
  getRecordById(id: number): Promise<Item<Record>>;
  getSamples(params: Params): Promise<PagedItems<Sample>>;
  getSampleById(id: number): Promise<Item<Sample>>;
  getPhenotypes(params: Params): Promise<PagedItems<Phenotype>>;
  getFastaGz(contig: string, pos: number): Promise<Uint8Array | null>;
  getGenesGz(): Promise<Uint8Array | null>;
  getBam(sampleId: string): Promise<Uint8Array | null>;
  getHtsFileMetadata(): Promise<HtsFileMetadata>;
  getAppMetadata(): Promise<AppMetadata>;
  getDecisionTree(): Promise<DecisionTree | null>;

  // testing purposes only
  isDatasetSupport(): boolean;
  getDatasetIds(): string[];
  selectDataset(id: string): void;
}

export interface Metadata {
  app: AppMetadata;
  htsFile: HtsFileMetadata;
  records: RecordMetadata;
}

export interface Resource {
  [key: string]: unknown;
}

export interface Params {
  query?: Query;
  sort?: SortOrder | SortOrder[];
  page?: number;
  size?: number;
}

export interface SortOrder {
  property: string | FieldMetadata;
  compare?: "asc" | "desc" | CompareFn;
}

export type CompareFn = (
  a: boolean | boolean[] | string | string[] | number | number[] | null,
  b: boolean | boolean[] | string | string[] | number | number[] | null
) => number;

export interface Sample extends Resource {
  person: Person;
  index: number;
  proband: boolean;
}

export interface Item<T extends Resource> {
  id: number;
  data: T;
}

export interface Items<T extends Resource> {
  items: Item<T>[];
  total: number;
}

export interface PagedItems<T extends Resource> extends Items<T> {
  page: Page;
}

export interface Page {
  number: number;
  size: number;
  totalElements: number;
}

export interface AppMetadata {
  name: string;
  version: string;
  args: string;
}

export interface HtsFileMetadata {
  htsFormat: string;
  uri: string;
  genomeAssembly: string;
}

export type SelectorPart = string | number;

export type Selector = SelectorPart | SelectorPart[];

export interface ComposedQuery {
  operator: "and" | "or";
  args: (QueryClause | ComposedQuery)[];
}

export type QueryOperator =
  | "=="
  | "~="
  | "~=_any"
  | "any_~=_any"
  | "!="
  | "in"
  | "!in"
  | "has_any"
  | "!has_any"
  | "any_has_any"
  | "!any_has_any"
  | ">"
  | ">="
  | "<"
  | "<=";

export interface QueryClause {
  operator: QueryOperator;
  selector: Selector;
  args: string | number | boolean | string[] | number[];
}

export type Query = QueryClause | ComposedQuery;

export interface Person {
  familyId: string;
  individualId: string;
  paternalId: string;
  maternalId: string;
  sex: "UNKNOWN_SEX" | "FEMALE" | "MALE" | "OTHER_SEX";
  affectedStatus: "MISSING" | "UNAFFECTED" | "AFFECTED";
}

export interface Phenotype extends Resource {
  subject: PhenotypeSubject;
  phenotypicFeaturesList: PhenotypicFeature[];
}

export interface PhenotypeSubject {
  id: string;
}

export interface OntologyClass {
  id: string;
  label: string;
}

export interface PhenotypicFeature {
  type: OntologyClass;
}
