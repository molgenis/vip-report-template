import { getConsequences, getInheritanceModesGeneSelector, getPhenotypesSelector, getVariant } from '@/globals/utils';
import { Vcf } from '@molgenis/vip-report-api';
import { mock } from 'ts-mockito';
import { Consequence } from '@/types/Consequence';

const expectedMetadata = {
  effect: { id: 'Consequence', type: 'STRING', number: { type: 'OTHER' }, description: 'Consequence' },
  symbol: { id: 'SYMBOL', type: 'STRING', number: { type: 'NUMBER', count: 1 }, description: 'SYMBOL' },
  inheritance: {
    id: 'InheritanceModesGene',
    type: 'STRING',
    number: { type: 'OTHER' },
    description: 'InheritanceModesGene'
  },
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
  },
  mvl: {
    id: 'VKGL_UMCG',
    type: 'STRING',
    number: { type: 'NUMBER', count: 1 },
    description: 'UMCG Managed variant list Classification'
  },
  vkgl: {
    id: 'VKGL_CL',
    type: 'STRING',
    number: { type: 'NUMBER', count: 1 },
    description: 'VKGL public consensus'
  }
};

function createCsqInfoMetadata(): Vcf.InfoMetadata {
  const effectInfoMetadata = mock<Vcf.InfoMetadata>();
  effectInfoMetadata.id = 'Consequence';
  const symbolInfoMetadata = mock<Vcf.InfoMetadata>();
  symbolInfoMetadata.id = 'SYMBOL';
  const hgvsCInfoMetadata = mock<Vcf.InfoMetadata>();
  hgvsCInfoMetadata.id = 'HGVSc';
  const hgvsPInfoMetadata = mock<Vcf.InfoMetadata>();
  hgvsPInfoMetadata.id = 'HGVSp';

  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'CSQ';
  infoMetadata.nested = {
    separator: '|',
    items: [effectInfoMetadata, hgvsCInfoMetadata, hgvsPInfoMetadata, symbolInfoMetadata]
  };

  return infoMetadata;
}

function createCsqInfoMetadataExtended(): Vcf.InfoMetadata {
  const pubMedMetadata = mock<Vcf.InfoMetadata>();
  pubMedMetadata.id = 'PUBMED';
  const clinSigMetadata = mock<Vcf.InfoMetadata>();
  clinSigMetadata.id = 'CLIN_SIG';
  const vkglMetadata = mock<Vcf.InfoMetadata>();
  vkglMetadata.id = 'VKGL_CL';
  const mvlMetadata = mock<Vcf.InfoMetadata>();
  mvlMetadata.id = 'VKGL_UMCG';
  const gnomADMetadata = mock<Vcf.InfoMetadata>();
  gnomADMetadata.id = 'gnomAD_AF';
  const hpoMetadata = mock<Vcf.InfoMetadata>();
  hpoMetadata.id = 'HPO';
  const inheritanceModesGeneMetadata = mock<Vcf.InfoMetadata>();
  inheritanceModesGeneMetadata.id = 'InheritanceModesGene';
  const pickMetadata = mock<Vcf.InfoMetadata>();
  pickMetadata.id = 'PICK';
  const alleleNumMetadata = mock<Vcf.InfoMetadata>();
  alleleNumMetadata.id = 'ALLELE_NUM';

  const csqInfoMetadata = createCsqInfoMetadata();
  if (csqInfoMetadata.nested !== undefined) {
    csqInfoMetadata.nested.items.push(pubMedMetadata);
    csqInfoMetadata.nested.items.push(clinSigMetadata);
    csqInfoMetadata.nested.items.push(mvlMetadata);
    csqInfoMetadata.nested.items.push(vkglMetadata);
    csqInfoMetadata.nested.items.push(gnomADMetadata);
    csqInfoMetadata.nested.items.push(hpoMetadata);
    csqInfoMetadata.nested.items.push(inheritanceModesGeneMetadata);
    csqInfoMetadata.nested.items.push(pickMetadata);
    csqInfoMetadata.nested.items.push(alleleNumMetadata);
  }
  return csqInfoMetadata;
}

function createAnnInfoMetadata(): Vcf.InfoMetadata {
  const effectInfoMetadata = mock<Vcf.InfoMetadata>();
  effectInfoMetadata.id = 'Annotation';
  const hgvsCInfoMetadata = mock<Vcf.InfoMetadata>();
  hgvsCInfoMetadata.id = 'HGVS.c';
  const hgvsPInfoMetadata = mock<Vcf.InfoMetadata>();
  hgvsPInfoMetadata.id = 'HGVS.p';
  const symbolInfoMetadata = mock<Vcf.InfoMetadata>();
  symbolInfoMetadata.id = 'Gene_Name';

  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'ANN';
  infoMetadata.nested = {
    separator: '|',
    items: [effectInfoMetadata, hgvsCInfoMetadata, hgvsPInfoMetadata, symbolInfoMetadata]
  };

  return infoMetadata;
}

test('get consequences in case of no info', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = {};

  const record = mock<Vcf.Record>();
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: []
  });
});

test('get consequences in case of no relevant info', () => {
  const infoMetadata = mock<Vcf.InfoMetadata>();
  infoMetadata.id = 'NOT_RELEVANT';

  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { NOT_RELEVANT: infoMetadata };

  const record = mock<Vcf.Record>();
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: []
  });
});

test('get consequences in case of CSQ info', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { CSQ: createCsqInfoMetadata() };

  const record = mock<Vcf.Record>();
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
        alleleIndex: null,
        effect: ['frameshift_variant'],
        symbol: 'symbol1',
        inheritance: [],
        primary: null,
        gnomAD: null,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: [],
        clinVar: [],
        mvl: null,
        vkgl: null
      },
      {
        alleleIndex: null,
        effect: ['intergenic_variant'],
        symbol: 'symbol0',
        inheritance: [],
        primary: null,
        gnomAD: null,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: [],
        clinVar: [],
        mvl: null,
        vkgl: null
      }
    ]
  });
});

test('get consequences in case of CSQ info with extended info', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { CSQ: createCsqInfoMetadataExtended() };

  const record = mock<Vcf.Record>();
  record.n = {
    CSQ: [
      [
        ['intergenic_variant'],
        'hgvsC0',
        'hgvsP0',
        'symbol0',
        ['12345678'],
        ['benign'],
        'LP',
        'VUS',
        0.2345,
        'HP:123',
        [],
        null,
        1
      ],
      [
        ['frameshift_variant'],
        'hgvsC1',
        'hgvsP1',
        'symbol1',
        ['12345678', '23456789'],
        ['likely_pathogenic', 'pathogenic'],
        'LB',
        'B',
        0.1234,
        'HP:123',
        [],
        '1',
        2
      ]
    ]
  };
  expect(getConsequences(record, recordMetadata)).toEqual({
    metadata: expectedMetadata,
    items: [
      {
        alleleIndex: 2,
        effect: ['frameshift_variant'],
        symbol: 'symbol1',
        inheritance: [],
        primary: '1',
        gnomAD: 0.1234,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: ['12345678', '23456789'],
        clinVar: ['likely_pathogenic', 'pathogenic'],
        vkgl: 'B',
        mvl: 'LB'
      },
      {
        alleleIndex: 1,
        effect: ['intergenic_variant'],
        symbol: 'symbol0',
        inheritance: [],
        primary: null,
        gnomAD: 0.2345,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: ['12345678'],
        clinVar: ['benign'],
        vkgl: 'VUS',
        mvl: 'LP'
      }
    ]
  });
});

test('get consequences in case of ANN info', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { ANN: createAnnInfoMetadata() };

  const record = mock<Vcf.Record>();
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
        alleleIndex: null,
        effect: ['missense_variant', 'frameshift_variant'],
        symbol: 'symbol1',
        inheritance: [],
        primary: null,
        gnomAD: null,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: [],
        clinVar: [],
        mvl: null,
        vkgl: null
      },
      {
        alleleIndex: null,
        effect: ['start_lost'],
        symbol: 'symbol0',
        inheritance: [],
        primary: null,
        gnomAD: null,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: [],
        clinVar: [],
        mvl: null,
        vkgl: null
      }
    ]
  });
});

test('get consequences in case of CSQ and ANN info', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { ANN: createAnnInfoMetadata(), CSQ: createCsqInfoMetadata() };

  const record = mock<Vcf.Record>();
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
        alleleIndex: null,
        effect: ['missense_variant', 'frameshift_variant'],
        symbol: 'symbol1',
        inheritance: [],
        primary: null,
        gnomAD: null,
        hgvsC: 'hgvsC1',
        hgvsP: 'hgvsP1',
        pubMed: [],
        clinVar: [],
        mvl: null,
        vkgl: null
      },
      {
        alleleIndex: null,
        effect: ['start_lost'],
        symbol: 'symbol0',
        inheritance: [],
        primary: null,
        gnomAD: null,
        hgvsC: 'hgvsC0',
        hgvsP: 'hgvsP0',
        pubMed: [],
        clinVar: [],
        mvl: null,
        vkgl: null
      },
      {
        alleleIndex: null,
        effect: ['intergenic_variant'],
        symbol: 'symbol2',
        inheritance: [],
        primary: null,
        gnomAD: null,
        hgvsC: 'hgvsC2',
        hgvsP: 'hgvsP2',
        pubMed: [],
        clinVar: [],
        mvl: null,
        vkgl: null
      }
    ]
  });
});

test('get phenotypes selector in case of VEP annotations with HPO', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { CSQ: createCsqInfoMetadataExtended() };

  expect(getPhenotypesSelector(recordMetadata)).toEqual(['n', 'CSQ', '*', 9]);
});

test('get phenotypes selector in case of VEP annotations without HPO', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { CSQ: createCsqInfoMetadata() };

  expect(() => getPhenotypesSelector(recordMetadata)).toThrow();
});

test('get phenotypes selector in case of SnpEff annotations', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { ANN: createAnnInfoMetadata() };

  expect(() => getPhenotypesSelector(recordMetadata)).toThrow();
});

test('get inheritance modes gene selector in case of VEP annotations with HPO', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { CSQ: createCsqInfoMetadataExtended() };

  expect(getInheritanceModesGeneSelector(recordMetadata)).toEqual(['n', 'CSQ', '*', 10]);
});

test('get inheritance modes gene selector in case of VEP annotations without HPO', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { CSQ: createCsqInfoMetadata() };

  expect(() => getInheritanceModesGeneSelector(recordMetadata)).toThrow();
});

test('get inheritance modes gene selector in case of SnpEff annotations', () => {
  const recordMetadata = mock<Vcf.Metadata>();
  recordMetadata.info = { ANN: createAnnInfoMetadata() };

  expect(() => getInheritanceModesGeneSelector(recordMetadata)).toThrow();
});

test('get variant for consequence with allele index', () => {
  const record = mock<Vcf.Record>();
  record.c = '1';
  record.p = 123;
  record.r = 'A';
  record.a = ['T', 'TA'];
  const consequence = mock<Consequence>();
  consequence.alleleIndex = 2;
  expect(getVariant(record, consequence)).toEqual({ chr: '1', pos: 123, ref: 'A', alt: 'TA' });
});

test('get variant for consequence without allele index', () => {
  const record = mock<Vcf.Record>();
  record.c = '1';
  record.p = 123;
  record.r = 'A';
  record.a = ['T', 'TA'];
  const consequence = mock<Consequence>();
  consequence.alleleIndex = null;
  expect(getVariant(record, consequence)).toBeNull();
});
