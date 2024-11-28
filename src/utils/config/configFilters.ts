import { ConfigFilters, ConfigJsonFilter, ConfigVip } from "../../types/config";
import { ConfigFilter } from "../../types/configFilter";
import { initConfigFilterComposed } from "./configFiltersComposed.ts";
import { MetadataContainer, SampleContainer } from "../api.ts";
import { initConfigFilterFixed } from "./configFiltersFixed.ts";
import { initConfigFiltersGenotype, initConfigFiltersInfo } from "./configFiltersField.ts";

export function initConfigFilters(
  config: ConfigJsonFilter[],
  configVip: ConfigVip,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigFilters {
  return config.flatMap((config) => createConfigFilter(config, configVip, metadata, sample));
}

function createConfigFilter(
  config: ConfigJsonFilter,
  configVip: ConfigVip,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigFilter[] {
  let configFilters: (ConfigFilter | null)[];
  switch (config.type) {
    case "fixed":
      configFilters = [initConfigFilterFixed(config)];
      break;
    case "info":
      configFilters = initConfigFiltersInfo(config, metadata.records);
      break;
    case "format":
      throw new Error(`unsupported config filter type '${config.type}'`); // not exposed by vip-report-api
    case "genotype":
      configFilters = sample ? initConfigFiltersGenotype(config, metadata.records, sample) : [];
      break;
    case "composed":
      configFilters = [initConfigFilterComposed(config, configVip, metadata, sample)];
      break;
  }
  return configFilters
    .filter((configFilter) => configFilter !== null)
    .map((config) => ({
      ...config,
      id: `${config.type}/${config.id}`, // prevent naming collisions for generic config filters
    }));
}
