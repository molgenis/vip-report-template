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
import configCram from "./config_cram.json";
import configVcf from "./config_vcf.json";
import { samples1, samples100 } from "./static";
import {
  decisionTree as decisionTreeGRCh37,
  fetchCrai as fetchCraiGRCh37,
  fetchCram as fetchCramGRCh37,
  fetchFastaGz as fetchFastaGzGRCh37,
  fetchGenesGz as fetchGenesGzGRCh37,
  fetchVcfFamily as fetchVcfFamilyGRCh37,
  samplesFamily as samplesFamilyGRCh37,
  sampleTree as sampleTreeGRCh37,
  vcfMeta as vcfMetaGRCh37,
} from "./GRCh37/static";
import {
  decisionTree as decisionTreeGRCh38,
  decisionTreeStr as decisionTreeStrGRCh38,
  fetchCrai as fetchCraiGRCh38,
  fetchCram as fetchCramGRCh38,
  fetchFastaGz as fetchFastaGzGRCh38,
  fetchGenesGz as fetchGenesGzGRCh38,
  fetchVcfFamily as fetchVcfFamilyGRCh38,
  fetchVcfNoVep as fetchVcfNoVepGRCh38,
  fetchVcfSamples0 as fetchVcfSamples0GRCh38,
  fetchVcfSamples1 as fetchVcfSamples1GRCh38,
  fetchVcfSamples100 as fetchVcfSamples100GRCh38,
  fetchVcfStr as fetchVcfStrGRCh38,
  samplesFamily as samplesFamilyGRCh38,
  samplesStr,
  sampleTree as sampleTreeGRCh38,
  vcfMeta as vcfMetaGRCh38,
} from "./GRCh38/static";
import { ArrayIndexOutOfBoundsException } from "../utils/error.ts";

/**
 * API client that uses mocked data as data source.
 */
export class MockApiClient implements Api {
  private apiClient: Api | undefined;

  async getConfig(): Promise<Json | null> {
    const apiClient = await this.getApiClient();
    return apiClient.getConfig();
  }

  async getFastaGz(contig: string, pos: number): Promise<Uint8Array | null> {
    const apiClient = await this.getApiClient();
    return apiClient.getFastaGz(contig, pos);
  }

  async getGenesGz(): Promise<Uint8Array | null> {
    const apiClient = await this.getApiClient();
    return apiClient.getGenesGz();
  }

  async getCram(sampleId: string): Promise<Cram | null> {
    const apiClient = await this.getApiClient();
    return apiClient.getCram(sampleId);
  }

  async getDecisionTree(): Promise<DecisionTree | null> {
    const apiClient = await this.getApiClient();
    return apiClient.getDecisionTree();
  }

  async getSampleTree(): Promise<DecisionTree | null> {
    const apiClient = await this.getApiClient();
    return apiClient.getSampleTree();
  }

  async getHtsFileMetadata(): Promise<HtsFileMetadata> {
    const apiClient = await this.getApiClient();
    return apiClient.getHtsFileMetadata();
  }

  async getAppMetadata(): Promise<AppMetadata> {
    const apiClient = await this.getApiClient();
    return apiClient.getAppMetadata();
  }

  async getPhenotypes(params: Params): Promise<PagedItems<Phenotype>> {
    const apiClient = await this.getApiClient();
    return apiClient.getPhenotypes(params);
  }

  async getRecordById(id: number): Promise<Item<VcfRecord>> {
    const apiClient = await this.getApiClient();
    return apiClient.getRecordById(id);
  }

  async getRecords(params: Params): Promise<PagedItems<VcfRecord>> {
    const apiClient = await this.getApiClient();
    return apiClient.getRecords(params);
  }

  async getRecordsMeta(): Promise<VcfMetadata> {
    const apiClient = await this.getApiClient();
    return apiClient.getRecordsMeta();
  }

  async getSampleById(id: number): Promise<Item<Sample>> {
    const apiClient = await this.getApiClient();
    return apiClient.getSampleById(id);
  }

  async getSamples(params: Params): Promise<PagedItems<Sample>> {
    const apiClient = await this.getApiClient();
    return apiClient.getSamples(params);
  }

  getDatasetIds(): string[] {
    return [
      "GRCh37 Family",
      "GRCh38 Family",
      "GRCh38 Family no VEP",
      "GRCh38 Samples 0",
      "GRCh38 Samples 1",
      "GRCh38 Samples 100",
      "GRCh38 Samples 1 STR",
    ];
  }

  async selectDataset(id: string): Promise<void> {
    this.apiClient = await this.createApiClient(id);
  }

  private async getApiClient(): Promise<Api> {
    if (this.apiClient !== undefined) {
      return this.apiClient;
    } else {
      const datasetIds = this.getDatasetIds();
      if (datasetIds.length < 1) throw new ArrayIndexOutOfBoundsException();
      this.apiClient = await this.createApiClient(datasetIds[0]!);
      return this.apiClient;
    }
  }

  private async fetchReportDataGRCh37Family(): Promise<ReportData> {
    return {
      config: configVcf as unknown as Json,
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
        vcf: await fetchVcfFamilyGRCh37(),
        fastaGz: await fetchFastaGzGRCh37(),
        genesGz: await fetchGenesGzGRCh37(),
        cram: {
          Patient: {
            cram: await fetchCramGRCh37(),
            crai: await fetchCraiGRCh37(),
          },
        },
      },
      decisionTree: decisionTreeGRCh37,
      sampleTree: sampleTreeGRCh37,
      vcfMeta: vcfMetaGRCh37,
    };
  }

  private async fetchReportDataGRCh38Family(): Promise<ReportData> {
    return {
      config: configVcf as unknown as Json,
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
        vcf: await fetchVcfFamilyGRCh38(),
        fastaGz: await fetchFastaGzGRCh38(),
        genesGz: await fetchGenesGzGRCh38(),
        cram: {
          Patient: {
            cram: await fetchCramGRCh38(),
            crai: await fetchCraiGRCh38(),
          },
        },
      },
      decisionTree: decisionTreeGRCh38,
      sampleTree: sampleTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };
  }

  private async fetchReportDataGRCh38FamilyNoVep() {
    return {
      config: configVcf as unknown as Json,
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
        vcf: await fetchVcfNoVepGRCh38(),
        fastaGz: await fetchFastaGzGRCh38(),
        genesGz: await fetchGenesGzGRCh38(),
        cram: {
          Patient: {
            cram: await fetchCramGRCh38(),
            crai: await fetchCraiGRCh38(),
          },
        },
      },
      decisionTree: decisionTreeGRCh38,
      sampleTree: sampleTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };
  }

  private async fetchReportDataGRCh38Data1Sample(): Promise<ReportData> {
    return {
      config: configVcf as unknown as Json,
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
        vcf: await fetchVcfSamples1GRCh38(),
        fastaGz: await fetchFastaGzGRCh38(),
        genesGz: await fetchGenesGzGRCh38(),
        cram: {
          SAMPLE1: {
            cram: await fetchCramGRCh38(),
            crai: await fetchCraiGRCh38(),
          },
        },
      },
      decisionTree: decisionTreeGRCh38,
      sampleTree: sampleTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };
  }

  private async fetchReportDataGRCh38Data100Samples(): Promise<ReportData> {
    return {
      config: configVcf as unknown as Json,
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
        vcf: await fetchVcfSamples100GRCh38(),
        fastaGz: await fetchFastaGzGRCh38(),
        genesGz: await fetchGenesGzGRCh38(),
      },
      decisionTree: decisionTreeGRCh38,
      sampleTree: sampleTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };
  }

  private async fetchReportDataGRCh38Str(): Promise<ReportData> {
    return {
      config: configCram as unknown as Json,
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
        vcf: await fetchVcfStrGRCh38(),
      },
      decisionTree: decisionTreeStrGRCh38,
      sampleTree: sampleTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };
  }

  private async fetchReportDataGRCh38NoSample(): Promise<ReportData> {
    return {
      config: configVcf as unknown as Json,
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
        vcf: await fetchVcfSamples0GRCh38(),
        fastaGz: await fetchFastaGzGRCh38(),
        genesGz: await fetchGenesGzGRCh38(),
      },
      decisionTree: decisionTreeGRCh38,
      sampleTree: sampleTreeGRCh38,
      vcfMeta: vcfMetaGRCh38,
    };
  }

  private async createApiClient(id: string): Promise<Api> {
    let reportData: ReportData;
    switch (id) {
      case "GRCh37 Family":
        reportData = await this.fetchReportDataGRCh37Family();
        break;
      case "GRCh38 Family":
        reportData = await this.fetchReportDataGRCh38Family();
        break;
      case "GRCh38 Family no VEP":
        reportData = await this.fetchReportDataGRCh38FamilyNoVep();
        break;
      case "GRCh38 Samples 0":
        reportData = await this.fetchReportDataGRCh38NoSample();
        break;
      case "GRCh38 Samples 1":
        reportData = await this.fetchReportDataGRCh38Data1Sample();
        break;
      case "GRCh38 Samples 100":
        reportData = await this.fetchReportDataGRCh38Data100Samples();
        break;
      case "GRCh38 Samples 1 STR":
        reportData = await this.fetchReportDataGRCh38Str();
        break;
      default:
        throw new Error(`unknown dataset id '${id}'`);
    }

    const vcf = parseVcf(new TextDecoder().decode(reportData.binary.vcf), reportData.vcfMeta);
    reportData.metadata.records = vcf.metadata;
    reportData.data.records = vcf.data;

    return new ApiClient(reportData);
  }
}
