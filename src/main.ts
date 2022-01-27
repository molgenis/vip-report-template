import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/sass/main.scss";
import { ApiClient, ReportData } from "./api/ApiClient";
import { ApiKey } from "./utils/symbols";
import apiReportData from "./mocks/ApiReportData";

declare global {
  interface Window {
    api: ReportData;
  }
}

const reportData = process.env.NODE_ENV === "production" ? window.api : apiReportData;
const apiClient = new ApiClient(reportData);

const app = createApp(App);
app.provide(ApiKey, apiClient);
app.use(router);
app.mount("#app");
