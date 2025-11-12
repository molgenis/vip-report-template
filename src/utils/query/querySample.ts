import { Query } from "@molgenis/vip-report-api";
import { MetadataContainer, SampleContainer } from "../api.ts";
import { createSelectorSample } from "./selector.ts";
import { ConfigVip } from "../../types/config";
import { FilterValueCategorical } from "../../types/configFilter";
import { createQueryFilterFieldCategorical } from "./queryFilterField.ts";
import { createQueryComposed } from "./query.ts";

export function createQuerySample(config: ConfigVip, sample: SampleContainer, meta: MetadataContainer): Query | null {
  const filterField = config.filter_field;
  if (filterField === null) return null;

  const filterValues = getFilterValues(config);
  const filterSelector = createSelectorSample(sample, filterField);
  const classFilter = createQueryFilterFieldCategorical(filterSelector, filterField, filterValues);
  const filters = [classFilter];
  if (meta.records.format.GT !== undefined) {
    const gtFilter = {
      selector: ["s", sample.item.id, "GT_type"],
      operator: "!in",
      args: ["HOM_REF", "NO_CALL", "UNAVAILABLE"],
    } as Query;
    filters.push(gtFilter);
  }
  return createQueryComposed(filters, "and");
}

function getFilterValues(config: ConfigVip): FilterValueCategorical {
  const filterSamplesClasses = config.params.vcf.filter_samples.classes.split(",");
  // add null values to make query match with records that do not have a value for the field
  return [...filterSamplesClasses, "__null"];
}
