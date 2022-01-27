import { Api, Metadata } from "./Api";

export interface ReportData {
  metadata: Metadata;
}

export class ApiClient implements Api {
  private reportData: ReportData;

  constructor(reportData: ReportData) {
    this.reportData = reportData;
  }

  async getMeta() {
    return this.reportData.metadata;
  }
}
