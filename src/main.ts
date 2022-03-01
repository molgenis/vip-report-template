import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/sass/main.scss";
import { ApiClient, ReportData } from "./api/ApiClient";
import { ApiKey } from "./utils/symbols";
import mockApiReportData from "./mocks/ApiReportData";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";

declare global {
  interface Window {
    api: ReportData;
  }
}

const reportData = process.env.NODE_ENV === "production" ? window.api : mockApiReportData;
const apiClient = new ApiClient(reportData);

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: en,
  },
});

const app = createApp(App);
app.provide(ApiKey, apiClient);
app.use(router);
app.use(i18n);
app.mount("#app");
