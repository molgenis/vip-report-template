import {
  Api,
  ApiClient,
  AppMetadata,
  Cram,
  DecisionTree,
  HtsFileMetadata,
  Item,
  Json,
  Metadata,
  PagedItems,
  Params,
  Phenotype,
  ReportData,
  Sample,
} from "@molgenis/vip-report-api";
import { parseVcf, VcfMetadata, VcfRecord } from "@molgenis/vip-report-vcf";
import config from "./config.json";
import { samples1, samples100 } from "./static";
import {
  crai as craiGRCh37,
  cram as cramGRCh37,
  decisionTree as decisionTreeGRCh37,
  fastaGz as fastaGzGRCh37,
  genesGz as genesGzGRCh37,
  samplesFamily as samplesFamilyGRCh37,
  samplesFamilyDuoPlusSister as samplesFamilyDuoPlusSisterGRCh37,
  sampleTree as sampleTreeGRCh37,
  vcfFamily as vcfFamilyGRCh37,
  vcfMeta as vcfMetaGRCh37,
  vcfNoVep as vcfNoVepGRCh37,
  vcfSamples0 as vcfSamples0GRCh37,
  vcfSamples1 as vcfSamples1GRCh37,
  vcfSamples100 as vcfSamples100GRCh37,
} from "./GRCh37/static";
import {
  crai as craiGRCh38,
  cram as cramGRCh38,
  decisionTree as decisionTreeGRCh38,
  decisionTreeStr as decisionTreeStrGRCh38,
  fastaGz as fastaGzGRCh38,
  genesGz as genesGzGRCh38,
  samplesFamily as samplesFamilyGRCh38,
  samplesStr,
  vcfFamily as vcfFamilyGRCh38,
  vcfMeta as vcfMetaGRCh38,
  vcfNoVep as vcfNoVepGRCh38,
  vcfSamples0 as vcfSamples0GRCh38,
  vcfSamples1 as vcfSamples1GRCh38,
  vcfSamples100 as vcfSamples100GRCh38,
  vcfStr as vcfStrGRCh38,
} from "./GRCh38/static";
import { ArrayIndexOutOfBoundsException } from "../utils/error.ts";

/**
 * API client that uses mocked data as data source.
 */
export class MockApiClient implements Api {
  private apiClient: Api;
  private readonly datasets: { [key: string]: ReportData };

  constructor() {
    this.datasets = MockApiClient.createDatasets();
    const datasetIds = this.getDatasetIds();
    if (datasetIds.length < 1) throw new ArrayIndexOutOfBoundsException();
    this.apiClient = this.createApiClient(datasetIds[0]!);
  }

  getConfig(): Promise<Json | null> {
    return this.apiClient.getConfig();
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

  getRecordById(id: number): Promise<Item<VcfRecord>> {
    return this.apiClient.getRecordById(id);
  }

  getRecords(params: Params): Promise<PagedItems<VcfRecord>> {
    return this.apiClient.getRecords(params);
  }

  getRecordsMeta(): Promise<VcfMetadata> {
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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
      config: config as unknown as Json,
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

    const mockReportDataStrGRCh38: ReportData = {
      config: config as unknown as Json,
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
      data: samplesStr,
      binary: {
        vcf: vcfStrGRCh38,
      },
      decisionTree: decisionTreeStrGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };

    const mockReportDataNoSampleGRCh38: ReportData = {
      config: config as unknown as Json,
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
    datasets["GRCh38 Samples 1 STR"] = mockReportDataStrGRCh38;
    return datasets;
  }

  private createApiClient(id: string): Api {
    const reportData = this.datasets[id];
    if (reportData === undefined) throw new Error();
    const vcf = parseVcf(new TextDecoder().decode(reportData.binary.vcf), reportData.vcfMeta);
    reportData.metadata.records = vcf.metadata;
    reportData.data.records = vcf.data;

    return new ApiClient(reportData);
  }
}
