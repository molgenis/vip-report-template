import { ReportData } from "@molgenis/vip-report-api/src/ApiClient";

export type EncodedReport = ReportData & {
  base85?: EncodedReportData;
};

export type EncodedReportData = {
  vcfGz: string;
  fastaGz?: { [key: string]: string };
  genesGz?: string;
  bam?: { [key: string]: string };
  decisionTreeGz?: string;
};

declare global {
  interface Window {
    api: EncodedReport;
  }
}
