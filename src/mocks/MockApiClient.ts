import {
  Api,
  ApiClient,
  AppMetadata,
  Cram,
  DecisionTree,
  Item,
  Json,
  PagedItems,
  Params,
  Phenotype,
  ReportData,
  Sample,
} from "@molgenis/vip-report-api";
import { VcfMetadata, VcfRecord } from "@molgenis/vip-report-vcf";
import {
  fetchCrai as fetchCraiGRCh38,
  fetchCram as fetchCramGRCh38,
  fetchDatabaseFamily,
  fetchDatabaseNoVep,
  fetchDatabaseSamples0,
  fetchDatabaseSamples1,
  fetchDatabaseSamples100,
  fetchDatabaseStr,
  fetchFastaGz as fetchFastaGzGRCh38,
  fetchGenesGz as fetchGenesGzGRCh38,
  fetchStrCrai as fetchStrCraiGRCh38,
  fetchStrCram as fetchStrCramGRCh38,
  fetchSqlWasm,
} from "./GRCh38/static";
import AsyncLock from "async-lock";
import initSqlJs from "sql.js";
import { ReportDatabase } from "@molgenis/vip-report-api";

const lock = new AsyncLock();

/**
 * API client that uses mocked data as data source.
 */
export class MockApiClient implements Api {
  private static dataSetIds = [
    "GRCh38 Family",
    "GRCh38 Family no VEP",
    "GRCh38 Samples 0",
    "GRCh38 Samples 1",
    "GRCh38 Samples 100",
    "GRCh38 Samples 1 STR",
  ];

  private dataSetId: string;
  private apiClient: Api | undefined;

  constructor() {
    this.dataSetId = MockApiClient.dataSetIds[0]!;
  }

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
    return apiClient.getRecordById(id, []);
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
    return MockApiClient.dataSetIds;
  }

  selectDataset(id: string): void {
    this.dataSetId = id;
    this.apiClient = undefined;
  }

  private async getApiClient(): Promise<Api> {
    if (this.apiClient === undefined) {
      await lock.acquire("apiClient", async () => {
        if (this.apiClient === undefined) {
          this.apiClient = await createApiClient(this.dataSetId);
        }
      });
    }

    if (this.apiClient === undefined) throw new Error();
    return this.apiClient;
  }
}

async function createApiClient(id: string): Promise<Api> {
  let reportData: ReportData;
  switch (id) {
    case "GRCh38 Family":
      reportData = await fetchReportDataGRCh38Family();
      break;
    case "GRCh38 Family no VEP":
      reportData = await fetchReportDataGRCh38FamilyNoVep();
      break;
    case "GRCh38 Samples 0":
      reportData = await fetchReportDataGRCh38NoSample();
      break;
    case "GRCh38 Samples 1":
      reportData = await fetchReportDataGRCh38Data1Sample();
      break;
    case "GRCh38 Samples 100":
      reportData = await fetchReportDataGRCh38Data100Samples();
      break;
    case "GRCh38 Samples 1 STR":
      reportData = await fetchReportDataGRCh38Str();
      break;
    default:
      throw new Error(`unknown dataset id '${id}'`);
  }

  const SQL = await initSqlJs({ wasmBinary: reportData.binary.wasmBinary!.buffer as ArrayBuffer });
  const reportDatabase = new ReportDatabase(new SQL.Database(reportData.database));
  return new ApiClient(reportDatabase, reportData.binary);
}

async function fetchReportDataGRCh38Family(): Promise<ReportData> {
  return {
    database: await fetchDatabaseFamily(),
    binary: {
      fastaGz: await fetchFastaGzGRCh38(),
      genesGz: await fetchGenesGzGRCh38(),
      cram: {
        Patient: {
          cram: await fetchCramGRCh38(),
          crai: await fetchCraiGRCh38(),
        },
      },
      wasmBinary: await fetchSqlWasm(),
    },
  };
}

async function fetchReportDataGRCh38FamilyNoVep() {
  return {
    database: await fetchDatabaseNoVep(),
    binary: {
      fastaGz: await fetchFastaGzGRCh38(),
      genesGz: await fetchGenesGzGRCh38(),
      cram: {
        Patient: {
          cram: await fetchCramGRCh38(),
          crai: await fetchCraiGRCh38(),
        },
      },
      wasmBinary: await fetchSqlWasm(),
    },
  };
}

async function fetchReportDataGRCh38Data1Sample(): Promise<ReportData> {
  return {
    database: await fetchDatabaseSamples1(),
    binary: {
      fastaGz: await fetchFastaGzGRCh38(),
      genesGz: await fetchGenesGzGRCh38(),
      cram: {
        SAMPLE1: {
          cram: await fetchCramGRCh38(),
          crai: await fetchCraiGRCh38(),
        },
      },
      wasmBinary: await fetchSqlWasm(),
    },
  };
}

async function fetchReportDataGRCh38Data100Samples(): Promise<ReportData> {
  return {
    database: await fetchDatabaseSamples100(),
    binary: {
      fastaGz: await fetchFastaGzGRCh38(),
      genesGz: await fetchGenesGzGRCh38(),
      wasmBinary: await fetchSqlWasm(),
    },
  };
}

async function fetchReportDataGRCh38Str(): Promise<ReportData> {
  return {
    database: await fetchDatabaseStr(),
    binary: {
      fastaGz: await fetchFastaGzGRCh38(),
      genesGz: await fetchGenesGzGRCh38(),
      cram: {
        Patient: {
          cram: await fetchStrCramGRCh38(),
          crai: await fetchStrCraiGRCh38(),
        },
      },
      wasmBinary: await fetchSqlWasm(),
    },
  };
}

async function fetchReportDataGRCh38NoSample(): Promise<ReportData> {
  return {
    database: await fetchDatabaseSamples0(),
    binary: {
      fastaGz: await fetchFastaGzGRCh38(),
      genesGz: await fetchGenesGzGRCh38(),
      wasmBinary: await fetchSqlWasm(),
    },
  };
}
