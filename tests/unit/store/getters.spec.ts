import initialState from '@/store/state';
import getters from '@/store/getters';
import { State } from '@/types/State';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';
import { mock } from 'ts-mockito';
import { Api, Vcf } from '@molgenis/vip-report-api';

test('samples returns empty array in case of no samples', () => {
  const testState: State = { ...initialState };
  expect(getters.samples(testState)).toStrictEqual([]);
});

test('samples returns array sorted by sample id', () => {
  const person0: Api.Person = mock<Api.Person>();
  person0.individualId = 'personC';
  const sample0: Api.Sample = mock<Api.Sample>();
  sample0.person = person0;
  const person1: Api.Person = mock<Api.Person>();
  person1.individualId = 'personA';
  const sample1: Api.Sample = mock<Api.Sample>();
  sample1.person = person1;
  const person2: Api.Person = mock<Api.Person>();
  person2.individualId = 'personB';
  const sample2: Api.Sample = mock<Api.Sample>();
  sample2.person = person2;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample2, sample0, sample1, sample2];

  const testState: State = { ...initialState, samples };
  expect(getters.samples(testState).map((sample) => sample.person.individualId)).toEqual([
    'personA',
    'personB',
    'personB',
    'personC'
  ]);
});

test('get sample by id returns null in case of no samples', () => {
  const testState: State = { ...initialState };
  expect(getters.getSampleById(testState)('MySampleId')).toBe(null);
});

test('get sample by id returns null in case of unknown sample', () => {
  const person0: Api.Person = mock<Api.Person>();
  person0.individualId = 'MySampleId';
  const sample0: Api.Sample = mock<Api.Sample>();
  sample0.person = person0;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample0];

  const testState: State = { ...initialState, samples };
  expect(getters.getSampleById(testState)('UnknownSampleId')).toBe(null);
});

test('get sample by id returns sample in case of known sample', () => {
  const person0: Api.Person = mock<Api.Person>();
  person0.individualId = 'MySampleId';
  const sample0: Api.Sample = mock<Api.Sample>();
  sample0.person = person0;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample0];

  const testState: State = { ...initialState, samples };
  expect(getters.getSampleById(testState)('MySampleId')).toBe(sample0);
});

test('get maternal sample for selected sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.maternalId = 'sampleMother';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const personMother: Api.Person = mock<Api.Person>();
  personMother.individualId = 'sampleMother';
  const sampleMother: Api.Sample = mock<Api.Sample>();
  sampleMother.person = personMother;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample, sampleMother];

  const testState: State = { ...initialState, samples, selectedSample: sample };
  expect(getters.sampleMaternal(testState)).toBe(sampleMother);
});

test('get maternal sample in case of no selected sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.maternalId = 'sampleMother';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const personMother: Api.Person = mock<Api.Person>();
  personMother.individualId = 'sampleMother';
  const sampleMother: Api.Sample = mock<Api.Sample>();
  sampleMother.person = personMother;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample, sampleMother];

  const testState: State = { ...initialState, samples };
  expect(getters.sampleMaternal(testState)).toBe(null);
});

test('get maternal sample in case of no samples', () => {
  const testState: State = { ...initialState };
  expect(getters.sampleMaternal(testState)).toBeNull();
});

test('get maternal sample in case of no samples with a selected sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.maternalId = '0';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const testState: State = { ...initialState, selectedSample: sample };
  expect(getters.sampleMaternal(testState)).toBeNull();
});

test('get maternal sample for selected sample without maternal sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.maternalId = '0';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample];

  const testState: State = { ...initialState, samples, selectedSample: sample };
  expect(getters.sampleMaternal(testState)).toBeNull();
});

test('get paternal sample for selected sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.paternalId = 'sampleFather';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const personFather: Api.Person = mock<Api.Person>();
  personFather.individualId = 'sampleFather';
  const sampleFather: Api.Sample = mock<Api.Sample>();
  sampleFather.person = personFather;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample, sampleFather];

  const testState: State = { ...initialState, samples, selectedSample: sample };
  expect(getters.samplePaternal(testState)).toBe(sampleFather);
});

test('get paternal sample in case of no selected sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.paternalId = 'sampleFather';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const personFather: Api.Person = mock<Api.Person>();
  personFather.individualId = 'sampleFather';
  const sampleFather: Api.Sample = mock<Api.Sample>();
  sampleFather.person = personFather;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample, sampleFather];

  const testState: State = { ...initialState, samples };
  expect(getters.samplePaternal(testState)).toBeNull();
});

test('get paternal sample for selected sample without paternal sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.paternalId = '0';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const personFather: Api.Person = mock<Api.Person>();
  personFather.individualId = 'sampleFather';
  const sampleFather: Api.Sample = mock<Api.Sample>();
  sampleFather.person = personFather;

  const samples: Api.PagedItems<Api.Sample> = mock<Api.PagedItems<Api.Sample>>();
  samples.items = [sample, sampleFather];

  const testState: State = { ...initialState, samples, selectedSample: sample };
  expect(getters.samplePaternal(testState)).toBeNull();
});

test('get paternal sample in case of no samples with a selected sample', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample';
  person.maternalId = '0';

  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const testState: State = { ...initialState, selectedSample: sample };
  expect(getters.samplePaternal(testState)).toBeNull();
});

test('get genomeBrowserDb for NCBI34 assembly', () => {
  const metadata = mock<Api.Metadata>();
  metadata.htsFile = mock<Api.HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'NCBI34';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg16);
});

test('get genomeBrowserDb for NCBI35 assembly', () => {
  const metadata = mock<Api.Metadata>();
  metadata.htsFile = mock<Api.HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'NCBI35';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg17);
});

test('get genomeBrowserDb for NCBI36 assembly', () => {
  const metadata = mock<Api.Metadata>();
  metadata.htsFile = mock<Api.HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'NCBI36';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg18);
});

test('get genomeBrowserDb for GRCh37 assembly', () => {
  const metadata = mock<Api.Metadata>();
  metadata.htsFile = mock<Api.HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'GRCh37';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg19);
});

test('get genomeBrowserDb for GRCh38 assembly', () => {
  const metadata = mock<Api.Metadata>();
  metadata.htsFile = mock<Api.HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'GRCh38';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg38);
});

test('get genomeBrowserDb for UNKNOWN assembly', () => {
  const metadata = mock<Api.Metadata>();
  metadata.htsFile = mock<Api.HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'UNKNOWN';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(null);
});

test('get genomeBrowserDb when no metadata available', () => {
  const testState: State = { ...initialState };
  expect(getters.genomeBrowserDb(testState)).toBe(null);
});

test('metadata has consequences', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CSQ';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { CSQ: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasConsequences(testState)).toBe(true);
});

test('metadata has no consequences', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'NO_CSQ';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { NO_CSQ: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasConsequences(testState)).toBe(false);
});

test('metadata has CAPICE', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CAP';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { CAP: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasCapice(testState)).toBe(true);
});

test('metadata has no CAPICE', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'NO_CAP';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { NO_CAP: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasCapice(testState)).toBe(false);
});

test('annotations are enabled', () => {
  const testState: State = { ...initialState, annotations: {} };
  expect(getters.isAnnotationEnabled(testState)).toBe(true);
});

test('annotations are disabled', () => {
  const testState: State = { ...initialState, annotations: null };
  expect(getters.isAnnotationEnabled(testState)).toBe(false);
});

test('get existing annotation', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample0';
  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const record = mock<Vcf.Record>();
  record.c = '1';
  record.p = 2;
  record.r = 'A';
  record.a = ['C', 'CT'];

  const annotation = {
    sampleId: 'sample0',
    chr: '1',
    pos: 2,
    ref: 'A',
    alt: ['C', 'CT'],
    geneMatch: 'true',
    class: 'LP',
    txt: null
  };
  const testState: State = {
    ...initialState,
    selectedSample: sample,
    annotations: { 'sample0_1_2_A_C,CT': annotation }
  };
  expect(getters.getAnnotation(testState)(record)).toEqual(annotation);
});

test('get non-existing annotation', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample1';
  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const record = mock<Vcf.Record>();
  record.c = '1';
  record.p = 2;
  record.r = 'A';
  record.a = ['C'];

  const annotation = {
    sampleId: 'sample1',
    chr: '1',
    pos: 2,
    ref: 'A',
    alt: ['C'],
    geneMatch: null,
    class: null,
    txt: null
  };
  const testState: State = {
    ...initialState,
    selectedSample: sample,
    annotations: {}
  };
  expect(getters.getAnnotation(testState)(record)).toEqual(annotation);
});

test('get annotation in case of no annotations', () => {
  const person: Api.Person = mock<Api.Person>();
  person.individualId = 'sample0';
  const sample: Api.Sample = mock<Api.Sample>();
  sample.person = person;

  const record = mock<Vcf.Record>();
  record.c = '1';
  record.p = 2;
  record.r = 'A';
  record.a = ['C', 'CT'];

  const testState: State = {
    ...initialState,
    selectedSample: sample
  };
  expect(() => getters.getAnnotation(testState)(record)).toThrow();
});

test('get annotation in case of no selected sample', () => {
  const testState: State = {
    ...initialState,
    annotations: {}
  };

  const record = mock<Vcf.Record>();
  record.c = '1';
  record.p = 2;
  record.r = 'A';
  record.a = ['C', 'CT'];

  expect(() => getters.getAnnotation(testState)(record)).toThrow();
});

test('whether records contain phenotype associations', () => {
  const hpoMetadata = mock<Vcf.InfoMetadata>();
  hpoMetadata.id = 'HPO';

  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = { separator: '|', items: [hpoMetadata] };

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { CSQ: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainPhenotypes(testState)).toEqual(true);
});

test('whether records contain phenotype associations with VEP without HPO', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = { separator: '|', items: [] };

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { CSQ: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainPhenotypes(testState)).toEqual(false);
});

test('whether records contain MVL annotations', () => {
  const mvlMetadata = mock<Vcf.InfoMetadata>();
  mvlMetadata.id = 'VKGL_UMCG';

  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = { separator: '|', items: [mvlMetadata] };

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { CSQ: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainMvl(testState)).toEqual(true);
});

test('whether records contain MVL annotations - false', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = { separator: '|', items: [] };

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { CSQ: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainMvl(testState)).toEqual(false);
});

test('whether records contain MVL annotations - no meta', () => {
  const testState: State = {
    ...initialState
  };
  expect(getters.isRecordsContainMvl(testState)).toEqual(false);
});

test('whether records contain MVL annotations - no info meta', () => {
  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainMvl(testState)).toEqual(false);
});

test('whether records contain MVL annotations - no nested meta', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = undefined;

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = { CSQ: infoMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainMvl(testState)).toEqual(false);
});

test('whether records contain phenotype associations without VEP', () => {
  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.info = {};

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainPhenotypes(testState)).toEqual(false);
});

test('whether records contain inheritance matching information. true.', () => {
  const formatMetadata = mock<Vcf.FormatMetadata>();
  formatMetadata.id = 'VIM';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.format = { VIM: formatMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isSamplesContainInheritance(testState)).toEqual(true);
});

test('whether records contain inheritance matching information. false.', () => {
  const formatMetadata = mock<Vcf.FormatMetadata>();
  formatMetadata.id = 'OTHER';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.format = { OTHER: formatMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isSamplesContainInheritance(testState)).toEqual(false);
});

test('whether records contain inheritance matching information. null.', () => {
  const metadata = null;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isSamplesContainInheritance(testState)).toEqual(false);
});

test('whether records contain denovo information. true.', () => {
  const formatMetadata = mock<Vcf.FormatMetadata>();
  formatMetadata.id = 'VID';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.format = { VID: formatMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isSamplesContainDenovo(testState)).toEqual(true);
});

test('whether records contain denovo information. false.', () => {
  const formatMetadata = mock<Vcf.FormatMetadata>();
  formatMetadata.id = 'OTHER';

  const recordsMetadata = mock<Vcf.Metadata>();
  recordsMetadata.format = { OTHER: formatMetadata };

  const metadata = mock<Api.Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isSamplesContainDenovo(testState)).toEqual(false);
});

test('whether records contain denovo information. null.', () => {
  const metadata = null;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isSamplesContainDenovo(testState)).toEqual(false);
});

test('whether records contain read depth information. null.', () => {
  const metadata = null;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isSamplesContainDepth(testState)).toEqual(false);
});
