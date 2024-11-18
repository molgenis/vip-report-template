import { ConfigFilters, ConfigStaticField, ConfigStaticFieldItem, ConfigVip } from "../../types/config";
import { ConfigFilter } from "../../types/configFilter";
import { initConfigFilterComposed } from "./configFiltersComposed.ts";
import { UnexpectedEnumValueException } from "../error.ts";
import { MetadataContainer, SampleContainer } from "../api.ts";
import { initConfigFilterFixed } from "./configFiltersFixed.ts";
import { initConfigFiltersGenotype, initConfigFiltersInfo } from "./configFiltersField.ts";

export function initConfigFilters(
  configStaticFields: ConfigStaticField[],
  configVip: ConfigVip,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigFilters {
  return configStaticFields.flatMap((configStaticFilter) => {
    let configFilters: ConfigFilter[];
    if (configStaticFilter.type === "group") {
      throw new Error("filter groups are not supported");
    } else {
      configFilters = createConfigFilterItem(configStaticFilter as ConfigStaticFieldItem, configVip, metadata, sample);
    }
    return configFilters;
  });
}

function createConfigFilterItem(
  configStaticField: ConfigStaticFieldItem,
  configVip: ConfigVip,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigFilter[] {
  let configFilters: (ConfigFilter | null)[];
  switch (configStaticField.type) {
    case "fixed":
      configFilters = [initConfigFilterFixed(configStaticField)];
      break;
    case "info":
      configFilters = initConfigFiltersInfo(configStaticField, metadata.records);
      break;
    case "format":
      throw new Error(`unsupported config filter type '${configStaticField.type}'`); // not exposed by vip-report-api
    case "genotype":
      configFilters = sample ? initConfigFiltersGenotype(configStaticField, metadata.records, sample) : []; //TODO inconsistent with cells which throws error instead of ignoring
      break;
    case "composed":
      configFilters = [initConfigFilterComposed(configStaticField, configVip, metadata, sample)];
      break;
    default:
      throw new UnexpectedEnumValueException(configStaticField["type"]);
  }
  return configFilters.filter((configFilter) => configFilter !== null);
}
