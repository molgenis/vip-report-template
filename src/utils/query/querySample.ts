import { Query } from "@molgenis/vip-report-api";
import { SampleContainer } from "../api.ts";
import { createSelectorSample } from "./selector.ts";
import { ConfigVip } from "../../types/config";
import { FilterValueCategorical } from "../../types/configFilter";
import { createQueryFilterFieldCategorical } from "./queryFilterField.ts";
import { createQueryFilterString } from "./queryFilter.ts";
import { createQueryComposed } from "./query.ts";

export function createQuerySample(config: ConfigVip, sample: SampleContainer): Query | null {
  const filterField = config.filter_field;
  if (filterField === null) return null;

  const filterValues = getFilterValues(config);
  const filterSelector = createSelectorSample(sample, filterField);

  //filter on samples to limit the query result
  const samples = [`${sample.item.id}`];
  if (sample.maternalSample !== null && sample.maternalSample !== undefined) {
    samples.push(`${sample.maternalSample.id}`);
  }
  if (sample.paternalSample !== null && sample.paternalSample !== undefined) {
    samples.push(`${sample.paternalSample.id}`);
  }
  //only selected sample or father/mother, only if sample filter is in configured values for this sample
  //and only if the selected sample is not homozygote for the reference allele
  const familyFilter = createQueryFilterString(["s", "sample_id"], samples, samples.length > 1, false);
  const classFilter = createQueryFilterFieldCategorical(filterSelector, filterField, filterValues);
  const gtFilter = { selector: ["s", "GT_type"], operator: "!=", args: "HOM_REF" } as Query;
  return createQueryComposed([familyFilter, classFilter, gtFilter], "and");
}

function getFilterValues(config: ConfigVip): FilterValueCategorical {
  const filterSamplesClasses = config.params.vcf.filter_samples.classes.split(",");
  // add null values to make query match with records that do not have a value for the field
  return [...filterSamplesClasses, "__null"];
}
