import { WindowApiClient } from "../../vip-report-api/src/WindowApiClient";

// lazy import MockApiClient to ensure that it is excluded from the build artifact
const api = import.meta.env.PROD
  ? new WindowApiClient()
  : await (function () {
      return import("./mocks/MockApiClient").then((module) => {
        return new module.MockApiClient();
      });
    })();

export default api;
