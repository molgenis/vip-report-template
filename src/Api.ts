import { ApiClient } from "./api/ApiClient";
import { parseVcf } from "./api/vcf/VcfParser";
import mockReportData from "./mocks/ReportData";

const reportData = import.meta.env.PROD ? window.api : mockReportData;
const vcf = parseVcf(new TextDecoder().decode(reportData.binary.vcf));
reportData.metadata.records = vcf.metadata;
reportData.data.records = vcf.data;
delete reportData.binary.vcf;

const api = new ApiClient(import.meta.env.PROD ? window.api : reportData);

export default api;
