import { ApiClient, ReportData } from "@molgenis/vip-report-api/src/ApiClient";
import { parseVcf } from "@molgenis/vip-report-vcf/src/VcfParser";
import {
  Api,
  AppMetadata,
  Cram,
  DecisionTree,
  HtsFileMetadata,
  Item,
  Metadata,
  PagedItems,
  Params,
  Phenotype,
  Sample,
} from "@molgenis/vip-report-api/src/Api";
import { samples1, samples100 } from "./static";
import {
  cram as cramGRCh37,
  crai as craiGRCh37,
  decisionTree as decisionTreeGRCh37,
  sampleTree as sampleTreeGRCh37,
  fastaGz as fastaGzGRCh37,
  genesGz as genesGzGRCh37,
  samplesFamily as samplesFamilyGRCh37,
  vcfMeta as vcfMetaGRCh37,
  vcfFamily as vcfFamilyGRCh37,
  vcfNoVep as vcfNoVepGRCh37,
  vcfSamples0 as vcfSamples0GRCh37,
  vcfSamples1 as vcfSamples1GRCh37,
  vcfSamples100 as vcfSamples100GRCh37,
  samplesFamilyDuoPlusSister as samplesFamilyDuoPlusSisterGRCh37,
} from "./GRCh37/static";
import {
  cram as cramGRCh38,
  crai as craiGRCh38,
  decisionTree as decisionTreeGRCh38,
  fastaGz as fastaGzGRCh38,
  genesGz as genesGzGRCh38,
  samplesFamily as samplesFamilyGRCh38,
  vcfMeta as vcfMetaGRCh38,
  vcfFamily as vcfFamilyGRCh38,
  vcfNoVep as vcfNoVepGRCh38,
  vcfSamples0 as vcfSamples0GRCh38,
  vcfSamples1 as vcfSamples1GRCh38,
  vcfSamples100 as vcfSamples100GRCh38,
} from "./GRCh38/static";
import { Metadata as RecordMetadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";

/**
 * API client that uses mocked data as data source.
 */
export class MockApiClient implements Api {
  private apiClient: Api;
  private readonly datasets: { [key: string]: ReportData };

  constructor() {
    this.datasets = MockApiClient.createDatasets();
    this.apiClient = this.createApiClient(this.getDatasetIds()[0]);
  }

  getFastaGz(contig: string, pos: number): Promise<Uint8Array | null> {
    return this.apiClient.getFastaGz(contig, pos);
  }

  getGenesGz(): Promise<Uint8Array | null> {
    return this.apiClient.getGenesGz();
  }

  getCram(sampleId: string): Promise<Cram | null> {
    return this.apiClient.getCram(sampleId);
  }

  getDecisionTree(): Promise<DecisionTree | null> {
    return this.apiClient.getDecisionTree();
  }

  getSampleTree(): Promise<DecisionTree | null> {
    return this.apiClient.getSampleTree();
  }

  getHtsFileMetadata(): Promise<HtsFileMetadata> {
    return this.apiClient.getHtsFileMetadata();
  }

  getAppMetadata(): Promise<AppMetadata> {
    return this.apiClient.getAppMetadata();
  }

  getPhenotypes(params: Params): Promise<PagedItems<Phenotype>> {
    return this.apiClient.getPhenotypes(params);
  }

  getRecordById(id: number): Promise<Item<Record>> {
    return this.apiClient.getRecordById(id);
  }

  getRecords(params: Params): Promise<PagedItems<Record>> {
    return this.apiClient.getRecords(params);
  }

  getRecordsMeta(): Promise<RecordMetadata> {
    return this.apiClient.getRecordsMeta();
  }

  getSampleById(id: number): Promise<Item<Sample>> {
    return this.apiClient.getSampleById(id);
  }

  getSamples(params: Params): Promise<PagedItems<Sample>> {
    return this.apiClient.getSamples(params);
  }

  isDatasetSupport(): boolean {
    return true;
  }

  getDatasetIds(): string[] {
    return Object.keys(this.datasets);
  }

  selectDataset(id: string): void {
    this.apiClient = this.createApiClient(id);
  }

  private static createDatasets() {
    const mockReportData: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b37_vip.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "/path/to/testdata_b37_vip.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh37",
        },
      } as Metadata,
      data: samplesFamilyGRCh37,
      binary: {
        vcf: vcfFamilyGRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
        cram: {
          Patient: {
            cram: cramGRCh37,
            crai: craiGRCh37,
          },
        },
      },
      decisionTree: decisionTreeGRCh37,
      sampleTree: sampleTreeGRCh37,
      vcfMeta: vcfMetaGRCh37,
    };

    const mockReportDataNoVep: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b37.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b37.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh37",
        },
      } as Metadata,
      data: samplesFamilyDuoPlusSisterGRCh37,
      binary: {
        vcf: vcfNoVepGRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
        cram: {
          Patient: {
            cram: cramGRCh37,
            crai: craiGRCh37,
          },
        },
      },
      decisionTree: decisionTreeGRCh37,
      vcfMeta: vcfMetaGRCh37,
    };

    const mockReportData1Sample: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b37_1Sample.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b37_1Sample.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh37",
        },
      } as Metadata,
      data: samples1,
      binary: {
        vcf: vcfSamples1GRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
        cram: {
          SAMPLE1: {
            cram: cramGRCh37,
            crai: craiGRCh37,
          },
        },
      },
      decisionTree: decisionTreeGRCh37,
      vcfMeta: vcfMetaGRCh37,
    };

    const mockReportData100Samples: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b37_100Samples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b37_100Samples.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh37",
        },
      } as Metadata,
      data: samples100,
      binary: {
        vcf: vcfSamples100GRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
      },
      decisionTree: decisionTreeGRCh37,
      vcfMeta: vcfMetaGRCh37,
    };

    const mockReportDataNoSample: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b37_1NoSamples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b37_NoSamples.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh37",
        },
      } as Metadata,
      data: { samples: [], phenotypes: [] },
      binary: {
        vcf: vcfSamples0GRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
      },
      decisionTree: decisionTreeGRCh37,
      vcfMeta: vcfMetaGRCh37,
    };

    const mockReportDataFamilyGRCh38: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b38_vip.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b38_vip.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh38",
        },
      } as Metadata,
      data: samplesFamilyGRCh38,
      binary: {
        vcf: vcfFamilyGRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
        cram: {
          Patient: {
            cram: cramGRCh38,
            crai: craiGRCh38,
          },
        },
      },
      decisionTree: decisionTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };

    const mockReportDataNoVepGRCh38: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b38.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b38.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh38",
        },
      } as Metadata,
      data: samplesFamilyGRCh38,
      binary: {
        vcf: vcfNoVepGRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
        cram: {
          Patient: {
            cram: cramGRCh38,
            crai: craiGRCh38,
          },
        },
      },
      decisionTree: decisionTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };

    const mockReportData1SampleGRCh38: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b38_1Sample.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b38_1Sample.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh38",
        },
      } as Metadata,
      data: samples1,
      binary: {
        vcf: vcfSamples1GRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
        cram: {
          SAMPLE1: {
            cram: cramGRCh38,
            crai: craiGRCh38,
          },
        },
      },
      decisionTree: decisionTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };

    const mockReportData100SamplesGRCh38: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b38_100Samples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b38_100Samples.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh38",
        },
      } as Metadata,
      data: samples100,
      binary: {
        vcf: vcfSamples100GRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
      },
      decisionTree: decisionTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };

    const mockReportDataNoSampleGRCh38: ReportData = {
      metadata: {
        app: {
          name: "vcf-report",
          version: "0.0.8",
          args: "-i testdata_b38_1NoSamples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
        },
        htsFile: {
          uri: "testdata_b38_NoSamples.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh38",
        },
      } as Metadata,
      data: { samples: [], phenotypes: [] },
      binary: {
        vcf: vcfSamples0GRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
      },
      decisionTree: decisionTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };

    const datasets: { [key: string]: ReportData } = {};
    datasets["GRCh37 Family"] = mockReportData;
    datasets["GRCh37 Family no VEP"] = mockReportDataNoVep;
    datasets["GRCh37 Samples 0"] = mockReportDataNoSample;
    datasets["GRCh37 Samples 1"] = mockReportData1Sample;
    datasets["GRCh37 Samples 100"] = mockReportData100Samples;
    datasets["GRCh38 Family"] = mockReportDataFamilyGRCh38;
    datasets["GRCh38 Family no VEP"] = mockReportDataNoVepGRCh38;
    datasets["GRCh38 Samples 0"] = mockReportDataNoSampleGRCh38;
    datasets["GRCh38 Samples 1"] = mockReportData1SampleGRCh38;
    datasets["GRCh38 Samples 100"] = mockReportData100SamplesGRCh38;
    return datasets;
  }

  private createApiClient(id: string): Api {
    const reportData = this.datasets[id];
    const vcf = parseVcf(new TextDecoder().decode(reportData.binary.vcf), reportData.vcfMeta);
    reportData.metadata.records = vcf.metadata;
    reportData.data.records = vcf.data;

    return new ApiClient(reportData);
  }
}
