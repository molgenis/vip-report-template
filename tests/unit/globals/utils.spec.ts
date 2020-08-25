import { getConsequences } from '@/globals/utils';
import { InfoMetadata, Record, RecordsMetadata } from '@molgenis/vip-report-api';
import { mock } from 'ts-mockito';

const expectedMetadata = {
  effect: { id: 'Consequence', type: 'STRING', number: { type: 'OTHER' }, description: 'Consequence' },
  symbol: { id: 'SYMBOL', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'SYMBOL' },
  hgvsC: { id: 'hgvsC', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsC' },
  hgvsP: { id: 'hgvsP', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsP' },
  pubMed: { id: 'PUBMED', type: 'INTEGER', number: { type: 'OTHER' }, description: 'PubMed' }
};

function createCsqInfoMetadata(): InfoMetadata {
  const effectInfoMetadata = mock<InfoMetadata>();
  effectInfoMetadata.id = 'Consequence';
  const symbolInfoMetadata = mock<InfoMetadata>();
  symbolInfoMetadata.id = 'SYMBOL';
  const hgvsCInfoMetadata = mock<InfoMetadata>();
  hgvsCInfoMetadata.id = 'HGVSc';
  const hgvsPInfoMetadata = mock<InfoMetadata>();
  hgvsPInfoMetadata.id = 'HGVSp';

  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = [effectInfoMetadata, hgvsCInfoMetadata, hgvsPInfoMetadata, symbolInfoMetadata];

  return infoMetadata;
}

function createCsqInfoMetadataWithPubMed(): InfoMetadata {
  const pubMedMetadata = mock<InfoMetadata>();
  pubMedMetadata.id = 'PUBMED';

  const csqInfoMetadata = createCsqInfoMetadata();
  if (csqInfoMetadata.nested !== undefined) {
    csqInfoMetadata.nested.push(pubMedMetadata);
  }
  return csqInfoMetadata;
}

function createAnnInfoMetadata(): InfoMetadata {
  const effectInfoMetadata = mock<InfoMetadata>();
  effectInfoMetadata.id = 'Annotation';
  const symbolInfoMetadata = mock<InfoMetadata>();
  symbolInfoMetadata.id = 'Gene_Name';
  const hgvsCInfoMetadata = mock<InfoMetadata>();
  hgvsCInfoMetadata.id = 'HGVS.c';
  const hgvsPInfoMetadata = mock<InfoMetadata>();
  hgvsPInfoMetadata.id = 'HGVS.p';

  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'ANN';
  infoMetadata.nested = [effectInfoMetadata, hgvsCInfoMetadata, hgvsPInfoMetadata, symbolInfoMetadata];

  return infoMetadata;
}

test('get consequences in case of no info', () => {
  const recordMetadata = mock<RecordsMetadata>();
  recordMetadata.info = [];

  const record = mock<Record>();
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: []
  });
});

test('get consequences in case of no relevant info', () => {
  const infoMetadata = mock<InfoMetadata>();
  infoMetadata.id = 'NOT_RELEVANT';

  const recordMetadata = mock<RecordsMetadata>();
  recordMetadata.info = [infoMetadata];

  const record = mock<Record>();
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: []
  });
});

test('get consequences in case of CSQ info', () => {
  const recordMetadata = mock<RecordsMetadata>();
  recordMetadata.info = [createCsqInfoMetadata()];

  const record = mock<Record>();
  record.n = {
    CSQ: [
      [['intergenic_variant'], 'hgvsC0', 'hgvsP0', 'symbol0'],
      [['frameshift_variant'], 'hgvsC1', 'hgvsP1', 'symbol1']
    ]
  };
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: [
      { effect: ['frameshift_variant'], symbol: 'symbol1', hgvsC: 'hgvsC1', hgvsP: 'hgvsP1', pubMed: [] },
      { effect: ['intergenic_variant'], symbol: 'symbol0', hgvsC: 'hgvsC0', hgvsP: 'hgvsP0', pubMed: [] }
    ]
  });
});

test('get consequences in case of CSQ info with PUBMED', () => {
  const recordMetadata = mock<RecordsMetadata>();
  recordMetadata.info = [createCsqInfoMetadataWithPubMed()];

  const record = mock<Record>();
  record.n = {
    CSQ: [
      [['intergenic_variant'], 'hgvsC0', 'hgvsP0', 'symbol0', ['12345678']],
      [['frameshift_variant'], 'hgvsC1', 'hgvsP1', 'symbol1', ['12345678', '23456789']]
    ]
  };
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: [
      {
        effect: ['frameshift_variant'],
        symbol: 'symbol1',
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: ['12345678', '23456789']
      },
      {
        effect: ['intergenic_variant'],
        symbol: 'symbol0',
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: ['12345678']
      }
    ]
  });
});

test('get consequences in case of ANN info', () => {
  const recordMetadata = mock<RecordsMetadata>();
  recordMetadata.info = [createAnnInfoMetadata()];

  const record = mock<Record>();
  record.n = {
    ANN: [
      [['start_lost'], 'hgvsC0', 'hgvsP0', 'symbol0'],
      [['missense_variant', 'frameshift_variant'], 'hgvsC1', 'hgvsP1', 'symbol1']
    ]
  };
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: [
      {
        effect: ['missense_variant', 'frameshift_variant'],
        symbol: 'symbol1',
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: []
      },
      { effect: ['start_lost'], symbol: 'symbol0', hgvsC: 'hgvsC0', hgvsP: 'hgvsP0', pubMed: [] }
    ]
  });
});

test('get consequences in case of CSQ and ANN info', () => {
  const recordMetadata = mock<RecordsMetadata>();
  recordMetadata.info = [createAnnInfoMetadata(), createCsqInfoMetadata()];

  const record = mock<Record>();
  record.n = {
    ANN: [
      [['start_lost'], 'hgvsC0', 'hgvsP0', 'symbol0'],
      [['missense_variant', 'frameshift_variant'], 'hgvsC1', 'hgvsP1', 'symbol1']
    ],
    CSQ: [[['intergenic_variant'], 'hgvsC2', 'hgvsP2', 'symbol2']]
  };
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: [
      {
        effect: ['missense_variant', 'frameshift_variant'],
        symbol: 'symbol1',
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: []
      },
      { effect: ['start_lost'], symbol: 'symbol0', hgvsC: 'hgvsC0', hgvsP: 'hgvsP0', pubMed: [] },
      { effect: ['intergenic_variant'], symbol: 'symbol2', hgvsC: 'hgvsC2', hgvsP: 'hgvsP2', pubMed: [] }
    ]
  });
});
