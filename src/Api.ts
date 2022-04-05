import { ApiClient } from "./api/ApiClient";
import { parseVcf } from "./api/vcf/VcfParser";
import mockReportData from "./mocks/ReportData";

const reportData = import.meta.env.PROD ? window.api : mockReportData.get("Family GRCh37");
if (reportData === undefined) {
  throw new Error("Report data is undefined.");
}
const vcf = parseVcf(new TextDecoder().decode(reportData.binary.vcf));
reportData.metadata.records = vcf.metadata;
reportData.data.records = vcf.data;
if (import.meta.env.PROD) {
  //Do not delete in dev mode because of dataset switching.
  delete reportData.binary.vcf;
}
const api = new ApiClient(reportData);

export default api;
