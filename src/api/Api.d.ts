export interface Api {
  getMeta(): Promise<Metadata>;
  getVcf(): Promise<string>;
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

export interface Resource {
  [key: string]: any;
}

export interface Items<T extends Resource> {
  items: T[];
  total: number;
}
