import { ApiClient } from "./api/ApiClient";
import reportData from "./mocks/ReportData";

const api = new ApiClient(import.meta.env.PROD ? window.api : reportData);
export default api;
