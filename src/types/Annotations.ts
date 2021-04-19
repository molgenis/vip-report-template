export interface Annotations {
  [key: string]: Annotation;
}

export interface Annotation {
  sampleId: string;
  chr: string;
  pos: number;
  ref: string;
  alt: (string | null)[];
  geneMatch: string | null;
  class: string | null;
  txt: string | null;
}
