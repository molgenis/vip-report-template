import { Query } from "@molgenis/vip-report-api";
import { SampleContainer } from "../api.ts";
import { createSelectorSample } from "./selector.ts";
import { ConfigVip } from "../../types/config";
import { FilterValueCategorical } from "../../types/configFilter";
import { createQueryFilterFieldCategorical } from "./queryFilterField.ts";

export function createQuerySample(config: ConfigVip, sample: SampleContainer): Query {
  const filterValues = getFilterValues(config);
  const selector = createSelectorSample(sample, config.filter_field);
  return createQueryFilterFieldCategorical(selector, config.filter_field, filterValues);
}

function getFilterValues(config: ConfigVip): FilterValueCategorical {
  const filterSamplesClasses = config.params.vcf.filter_samples.classes.split(",");
  // add null values to make query match with records that do not have a value for the field
  return [...filterSamplesClasses, "__null"];
}
