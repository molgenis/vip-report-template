import { getConsequences } from '@/globals/utils';
import { InfoMetadata, Record, RecordsMetadata } from '@molgenis/vip-report-api';
import { mock } from 'ts-mockito';

const expectedMetadata = {
  effect: { id: 'Consequence', type: 'STRING', number: { type: 'OTHER' }, description: 'Consequence' },
  symbol: { id: 'SYMBOL', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'SYMBOL' },
  hgvsC: { id: 'hgvsC', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsC' },
  hgvsP: { id: 'hgvsP', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'hgvsP' },
  pubMed: {
    id: 'PUBMED',
    type: 'INTEGER',
    number: { type: 'OTHER' },
    description: 'Pubmed ID(s) of publications that cite existing variant'
  },
  clinVar: {
    id: 'CLIN_SIG',
    type: 'STRING',
    number: { type: 'OTHER' },
    description: 'ClinVar clinical significance of the dbSNP variant'
  },
  gnomAD: {
    id: 'gnomAD_AF',
    type: 'FLOAT',
    number: { type: 'NUMBER', count: 1 },
    description: 'Frequency of existing variant in gnomAD exomes combined population'
  }
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

function createCsqInfoMetadataExtended(): InfoMetadata {
  const pubMedMetadata = mock<InfoMetadata>();
  pubMedMetadata.id = 'PUBMED';
  const clinSigMetadata = mock<InfoMetadata>();
  clinSigMetadata.id = 'CLIN_SIG';
  const gnomADMetadata = mock<InfoMetadata>();
  gnomADMetadata.id = 'gnomAD_AF';

  const csqInfoMetadata = createCsqInfoMetadata();
  if (csqInfoMetadata.nested !== undefined) {
    csqInfoMetadata.nested.push(pubMedMetadata);
    csqInfoMetadata.nested.push(clinSigMetadata);
    csqInfoMetadata.nested.push(gnomADMetadata);
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
      {
        effect: ['frameshift_variant'],
        symbol: 'symbol1',
        gnomAD: null,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: [],
        clinVar: []
      },
      {
        effect: ['intergenic_variant'],
        symbol: 'symbol0',
        gnomAD: null,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: [],
        clinVar: []
      }
    ]
  });
});

test('get consequences in case of CSQ info with extended info', () => {
  const recordMetadata = mock<RecordsMetadata>();
  recordMetadata.info = [createCsqInfoMetadataExtended()];

  const record = mock<Record>();
  record.n = {
    CSQ: [
      [['intergenic_variant'], 'hgvsC0', 'hgvsP0', 'symbol0', ['12345678'], ['benign'], 0.2345],
      [
        ['frameshift_variant'],
        'hgvsC1',
        'hgvsP1',
        'symbol1',
        ['12345678', '23456789'],
        ['likely_pathogenic', 'pathogenic'],
        0.1234
      ]
    ]
  };
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: [
      {
        effect: ['frameshift_variant'],
        symbol: 'symbol1',
        gnomAD: 0.1234,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: ['12345678', '23456789'],
        clinVar: ['likely_pathogenic', 'pathogenic']
      },
      {
        effect: ['intergenic_variant'],
        symbol: 'symbol0',
        gnomAD: 0.2345,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: ['12345678'],
        clinVar: ['benign']
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
        gnomAD: null,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: [],
        clinVar: []
      },
      {
        effect: ['start_lost'],
        symbol: 'symbol0',
        gnomAD: null,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: [],
        clinVar: []
      }
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
        gnomAD: null,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: [],
        clinVar: []
      },
      {
        effect: ['start_lost'],
        symbol: 'symbol0',
        gnomAD: null,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: [],
        clinVar: []
      },
      {
        effect: ['intergenic_variant'],
        symbol: 'symbol2',
        gnomAD: null,
        hgvsC: 'hgvsC2',
        hgvsP: 'hgvsP2',
        pubMed: [],
        clinVar: []
      }
    ]
  });
});
