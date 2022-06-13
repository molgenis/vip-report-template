import { Component, createResource, Show } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Phenotype, PhenotypicFeature, Sample } from "@molgenis/vip-report-api/src/Api";
import { InfoFilters } from "./InfoFilters";
import { SamplesFilters } from "./SamplesFilters";
import { EMPTY_PHENOTYPES, fetchPhenotypes } from "../../utils/ApiUtils";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";

export const Filters: Component<{
  fields: FieldMetadata[];
  samplesFields: { sample: Sample; fields: FieldMetadata[] }[];
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  sampleId?: string;
}> = (props) => {
  const [phenotypes] = createResource({}, fetchPhenotypes, { initialValue: EMPTY_PHENOTYPES });

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
        onChange={props.onChange}
        onClear={props.onClear}
        defaultValues={props.sampleId !== undefined ? { HPO: getHpoTermsForSample(props.sampleId) } : {}}
      />
      <SamplesFilters
        samplesFields={props.samplesFields}
        onChange={props.onChange}
        onClear={props.onClear}
        defaultValues={{ VIM: true, DP: true }}
      />
    </Show>
  );
};
