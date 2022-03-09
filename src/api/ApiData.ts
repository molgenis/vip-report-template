// this is .ts instead of .d.ts file to work around https://github.com/TypeStrong/ts-loader/issues/1036
export interface Container {
  metadata: Metadata;
  data: Data;
  base85: EncodedData;
}

export interface Metadata {
  app: AppMetadata;
  htsFile: HtsFileMetadata;
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

export interface Data {
  [key: string]: Items<Resource>;
}

export interface Items<T extends Resource> {
  items: T[];
  total: number;
}

export interface EncodedData extends EncodedDataContainer {
  vcfGz: string;
  fastaGz?: EncodedDataContainer;
  genesGz?: string;
  bam?: EncodedDataContainer;
  decisionTreeGz?: string;
}

export interface Resource {
  [key: string]: any;
}

export interface EncodedDataContainer {
  [key: string]: string | EncodedDataContainer | undefined;
}
