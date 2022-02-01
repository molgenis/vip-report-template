import { Api, Metadata } from "./Api";

export interface ReportData {
  metadata: Metadata;
  binary: BinaryReportData;
}

export interface BinaryReportData {
  vcf: Uint8Array;
  fastaGz?: { [key: string]: Uint8Array };
  genesGz?: Uint8Array;
  bam?: { [key: string]: Uint8Array };
  decisionTree?: Uint8Array;
}

export class ApiClient implements Api {
  private reportData: ReportData;

  constructor(reportData: ReportData) {
    this.reportData = reportData;
  }

  async getMeta() {
    return Promise.resolve(this.reportData.metadata);
  }

  async getVcf(): Promise<string> {
    return Promise.resolve(new TextDecoder().decode(this.reportData.binary.vcf));
  }
}
