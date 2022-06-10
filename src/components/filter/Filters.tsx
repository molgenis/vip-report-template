import { Component, createResource, Show } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Phenotype, PhenotypicFeature, Sample } from "@molgenis/vip-report-api/src/Api";
import { InfoFilterQueries, InfoFilters, InfoFiltersChangeEvent } from "./InfoFilters";
import { SamplesFilterQueries, SamplesFilters, SamplesFiltersChangeEvent } from "./SamplesFilters";
import { EMPTY_PHENOTYPES, fetchPhenotypes } from "../../utils/ApiUtils";

export type FilterQueries = {
  infoQueries: InfoFilterQueries;
  samplesQueries: SamplesFilterQueries;
};

export type FiltersChangeEvent = {
  queries: FilterQueries;
};

export const Filters: Component<{
  fields: FieldMetadata[];
  samplesFields: { sample: Sample; fields: FieldMetadata[] }[];
  onChange: (event: FiltersChangeEvent) => void;
  sampleId?: string;
}> = (props) => {
  const [phenotypes] = createResource({}, fetchPhenotypes, { initialValue: EMPTY_PHENOTYPES });
  const queries: FilterQueries = { infoQueries: {}, samplesQueries: {} }; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFiltersChange = () => props.onChange({ queries });

  const onInfoFiltersChange = (event: InfoFiltersChangeEvent) => {
    queries.infoQueries = event.queries;
    onFiltersChange();
  };

  const onSamplesFiltersChange = (event: SamplesFiltersChangeEvent) => {
    queries.samplesQueries = event.queries;
    onFiltersChange();
  };
  function getHpoTermsForSample(sampleId: string) {
    const hpoTerms: string[] = [];
    phenotypes().items.forEach((item: Item<Phenotype>) => {
      if (item.data.subject.id === sampleId) {
        item.data.phenotypicFeaturesList.forEach((phenotypicFeature: PhenotypicFeature) => {
          hpoTerms.push(phenotypicFeature.type.id);
        });
      }
    });
    return hpoTerms;
  }

  return (
    <Show when={!phenotypes.loading}>
      <InfoFilters
        fields={props.fields}
        onChange={onInfoFiltersChange}
        defaultValues={props.sampleId !== undefined ? { HPO: getHpoTermsForSample(props.sampleId) } : {}}
      />
      <SamplesFilters
        samplesFields={props.samplesFields}
        onChange={onSamplesFiltersChange}
        defaultValues={{ VIM: true, DP: true }}
      />
    </Show>
  );
};
