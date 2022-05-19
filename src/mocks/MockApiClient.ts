import { ApiClient, ReportData } from "@molgenis/vip-report-api/src/ApiClient";
import { parseVcf } from "@molgenis/vip-report-vcf/src/VcfParser";
import {
  Api,
  AppMetadata,
  HtsFileMetadata,
  Item,
  Metadata,
  PagedItems,
  Params,
  Phenotype,
  Sample,
} from "@molgenis/vip-report-api/src/Api";
import { samples1, samples100, samplesFamily } from "./static";
import {
  bam as bamGRCh37,
  decisionTree as decisionTreeGRCh37,
  fastaGz as fastaGzGRCh37,
  genesGz as genesGzGRCh37,
  vcfFamily as vcfFamilyGRCh37,
  vcfNoVep as vcfNoVepGRCh37,
  vcfSamples0 as vcfSamples0GRCh37,
  vcfSamples1 as vcfSamples1GRCh37,
  vcfSamples100 as vcfSamples100GRCh37,
} from "./GRCh37/static";
import {
  bam as bamGRCh38,
  decisionTree as decisionTreeGRCh38,
  fastaGz as fastaGzGRCh38,
  genesGz as genesGzGRCh38,
  vcfFamily as vcfFamilyGRCh38,
  vcfNoVep as vcfNoVepGRCh38,
  vcfSamples0 as vcfSamples0GRCh38,
  vcfSamples1 as vcfSamples1GRCh38,
  vcfSamples100 as vcfSamples100GRCh38,
} from "./GRCh38/static";
import { Metadata as RecordMetadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { DecisionTree } from "@molgenis/vip-report-api/src/Api";

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

  getBam(sampleId: string): Promise<Uint8Array | null> {
    return this.apiClient.getBam(sampleId);
  }

  getDecisionTree(): Promise<DecisionTree | null> {
    return this.apiClient.getDecisionTree();
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
          uri: "testdata_b37_vip.vcf",
          htsFormat: "VCF",
          genomeAssembly: "GRCh37",
        },
      } as Metadata,
      data: samplesFamily,
      binary: {
        vcf: vcfFamilyGRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
        bam: {
          Patient: bamGRCh37,
        },
      },
      decisionTree: decisionTreeGRCh37,
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
      data: samplesFamily,
      binary: {
        vcf: vcfNoVepGRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
        bam: {
          Patient: bamGRCh37,
        },
      },
      decisionTree: decisionTreeGRCh37,
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
        bam: {
          SAMPLE1: bamGRCh37,
        },
      },
      decisionTree: decisionTreeGRCh37,
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
      data: { samples: [] },
      binary: {
        vcf: vcfSamples0GRCh37,
        fastaGz: fastaGzGRCh37,
        genesGz: genesGzGRCh37,
      },
      decisionTree: decisionTreeGRCh37,
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
      data: samplesFamily,
      binary: {
        vcf: vcfFamilyGRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
        bam: {
          Patient: bamGRCh38,
        },
      },
      decisionTree: decisionTreeGRCh38,
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
      data: samplesFamily,
      binary: {
        vcf: vcfNoVepGRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
        bam: {
          Patient: bamGRCh38,
        },
      },
      decisionTree: decisionTreeGRCh38,
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
        bam: {
          SAMPLE1: bamGRCh38,
        },
      },
      decisionTree: decisionTreeGRCh38,
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
      data: { samples: [] },
      binary: {
        vcf: vcfSamples0GRCh38,
        fastaGz: fastaGzGRCh38,
        genesGz: genesGzGRCh38,
      },
      decisionTree: decisionTreeGRCh38,
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
    const vcf = parseVcf(new TextDecoder().decode(reportData.binary.vcf));
    reportData.metadata.records = vcf.metadata;
    reportData.data.records = vcf.data;

    return new ApiClient(reportData);
  }
}
