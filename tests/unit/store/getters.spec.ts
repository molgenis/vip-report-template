import initialState from '@/store/state';
import getters from '@/store/getters';
import { State } from '@/types/State';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';
import { mock } from 'ts-mockito';
import {
  HtsFileMetadata,
  InfoMetadata,
  Metadata,
  PagedItems,
  Person,
  Record,
  RecordsMetadata,
  Sample
} from '@molgenis/vip-report-api';

test('samples returns empty array in case of no samples', () => {
  const testState: State = { ...initialState };
  expect(getters.samples(testState)).toStrictEqual([]);
});

test('samples returns array sorted by sample id', () => {
  const person0: Person = mock<Person>();
  person0.individualId = 'personC';
  const sample0: Sample = mock<Sample>();
  sample0.person = person0;
  const person1: Person = mock<Person>();
  person1.individualId = 'personA';
  const sample1: Sample = mock<Sample>();
  sample1.person = person1;
  const person2: Person = mock<Person>();
  person2.individualId = 'personB';
  const sample2: Sample = mock<Sample>();
  sample2.person = person2;

  const samples: PagedItems<Sample> = mock<PagedItems<Sample>>();
  samples.items = [sample2, sample0, sample1, sample2];

  const testState: State = { ...initialState, samples };
  expect(getters.samples(testState).map(sample => sample.person.individualId)).toEqual([
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
  const person0: Person = mock<Person>();
  person0.individualId = 'MySampleId';
  const sample0: Sample = mock<Sample>();
  sample0.person = person0;

  const samples: PagedItems<Sample> = mock<PagedItems<Sample>>();
  samples.items = [sample0];

  const testState: State = { ...initialState, samples };
  expect(getters.getSampleById(testState)('UnknownSampleId')).toBe(null);
});

test('get sample by id returns sample in case of known sample', () => {
  const person0: Person = mock<Person>();
  person0.individualId = 'MySampleId';
  const sample0: Sample = mock<Sample>();
  sample0.person = person0;

  const samples: PagedItems<Sample> = mock<PagedItems<Sample>>();
  samples.items = [sample0];

  const testState: State = { ...initialState, samples };
  expect(getters.getSampleById(testState)('MySampleId')).toBe(sample0);
});

test('get genomeBrowserDb for NCBI34 assembly', () => {
  const metadata = mock<Metadata>();
  metadata.htsFile = mock<HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'NCBI34';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg16);
});

test('get genomeBrowserDb for NCBI35 assembly', () => {
  const metadata = mock<Metadata>();
  metadata.htsFile = mock<HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'NCBI35';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg17);
});

test('get genomeBrowserDb for NCBI36 assembly', () => {
  const metadata = mock<Metadata>();
  metadata.htsFile = mock<HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'NCBI36';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg18);
});

test('get genomeBrowserDb for GRCh37 assembly', () => {
  const metadata = mock<Metadata>();
  metadata.htsFile = mock<HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'GRCh37';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg19);
});

test('get genomeBrowserDb for GRCh38 assembly', () => {
  const metadata = mock<Metadata>();
  metadata.htsFile = mock<HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'GRCh38';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(GenomeBrowserDb.hg38);
});

test('get genomeBrowserDb for UNKNOWN assembly', () => {
  const metadata = mock<Metadata>();
  metadata.htsFile = mock<HtsFileMetadata>();
  metadata.htsFile.genomeAssembly = 'UNKNOWN';

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.genomeBrowserDb(testState)).toBe(null);
});

test('get genomeBrowserDb when no metadata available', () => {
  const testState: State = { ...initialState };
  expect(getters.genomeBrowserDb(testState)).toBe(null);
});

test('metadata has consequences', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'CSQ';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasConsequences(testState)).toBe(true);
});

test('metadata has no consequences', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'NO_CSQ';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasConsequences(testState)).toBe(false);
});

test('metadata has mvl', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'MVL';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasMvl(testState)).toBe(true);
});

test('metadata has no mvl', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'NO_MVL';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasMvl(testState)).toBe(false);
});

test('metadata has vkgl', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'VKGL';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasVkgl(testState)).toBe(true);
});

test('metadata has no vkgl', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'NO_VKGL';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasVkgl(testState)).toBe(false);
});

test('metadata has CAPICE', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'CAP';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = { ...initialState, metadata: metadata };
  expect(getters.hasCapice(testState)).toBe(true);
});

test('metadata has no CAPICE', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'NO_CAP';

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
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
  const person: Person = mock<Person>();
  person.individualId = 'sample0';
  const sample: Sample = mock<Sample>();
  sample.person = person;

  const record = mock<Record>();
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
  const person: Person = mock<Person>();
  person.individualId = 'sample1';
  const sample: Sample = mock<Sample>();
  sample.person = person;

  const record = mock<Record>();
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
  const person: Person = mock<Person>();
  person.individualId = 'sample0';
  const sample: Sample = mock<Sample>();
  sample.person = person;

  const record = mock<Record>();
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

  const record = mock<Record>();
  record.c = '1';
  record.p = 2;
  record.r = 'A';
  record.a = ['C', 'CT'];

  expect(() => getters.getAnnotation(testState)(record)).toThrow();
});

test('whether records contain phenotype associations', () => {
  const hpoMetadata = mock<InfoMetadata>();
  hpoMetadata.id = 'HPO';

  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = [hpoMetadata];

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainPhenotypes(testState)).toEqual(true);
});

test('whether records contain phenotype associations with VEP without HPO', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = [];

  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [infoMetadata];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainPhenotypes(testState)).toEqual(false);
});

test('whether records contain phenotype associations without VEP', () => {
  const recordsMetadata = mock<RecordsMetadata>();
  recordsMetadata.info = [];

  const metadata = mock<Metadata>();
  metadata.records = recordsMetadata;

  const testState: State = {
    ...initialState,
    metadata: metadata
  };
  expect(getters.isRecordsContainPhenotypes(testState)).toEqual(false);
});
