export interface Api {
  getMeta(): Promise<Metadata>;
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
