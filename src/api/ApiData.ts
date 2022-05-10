// this is .ts instead of .d.ts file to work around https://github.com/TypeStrong/ts-loader/issues/1036
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
