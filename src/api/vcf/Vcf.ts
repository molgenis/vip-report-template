// this is .ts instead of .d.ts file to work around https://github.com/TypeStrong/ts-loader/issues/1036
import { FormatMetadataContainer, Genotype, RecordSample } from "./SampleDataParser";
import { InfoContainer, InfoMetadataContainer } from "./VcfParser";

export { FormatMetadataContainer, Genotype, RecordSample };

export interface Metadata {
  header: Header;
  info: InfoMetadataContainer;
  format: FormatMetadataContainer;
}

export interface Container {
  metadata: Metadata;
  data: Record[];
}

export interface Header {
  samples: string[];
}

export type Record = {
  getId: () => string;
  c: string;
  p: number;
  i: string[];
  r: string;
  a: (string | null)[];
  q: number | null;
  f: string[];
  n: InfoContainer;
  s: RecordSample[];
};
