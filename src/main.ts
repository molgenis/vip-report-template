import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/sass/main.scss";
import { ApiClient, ReportData } from "./api/ApiClient";
import { ApiKey } from "./utils/symbols";
import mockApiReportData from "./mocks/ApiReportData";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleXmark, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCircleXmark, faFilter, faSearch);

declare global {
  interface Window {
    api: ReportData;
  }
}

const reportData = import.meta.env.PROD ? window.api : mockApiReportData;

const apiClient = new ApiClient(reportData);

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: en,
  },
});

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);
app.provide(ApiKey, apiClient);
app.use(router);
app.use(i18n);
if (import.meta.env.DEV) {
  app.config.performance = true;
}
app.mount("#app");
