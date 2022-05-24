import { Component, createResource, For, Show } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";
import { Item, OntologyClass, Phenotype, PhenotypicFeature } from "@molgenis/vip-report-api/src/Api";
import { EMPTY_PARAMS, EMPTY_PHENOTYPES, fetchPhenotypes } from "../../utils/ApiUtils";
import { Loader } from "../Loader";
import { HpoTerm } from "../record/info/HpoTerm";

const [phenotypes] = createResource(EMPTY_PARAMS, fetchPhenotypes, { initialValue: EMPTY_PHENOTYPES });

function getHpoTermsForSample(sampleId: string): OntologyClass[] {
  const hpoTerms: OntologyClass[] = [];
  phenotypes().items.forEach((item: Item<Phenotype>) => {
    if (item.data.subject.id === sampleId) {
      item.data.phenotypicFeaturesList.forEach((phenotypicFeature: PhenotypicFeature) => {
        hpoTerms.push(phenotypicFeature.type);
      });
    }
  });
  return hpoTerms;
}

export type CheckboxGroup = {
  [key: string]: boolean;
};
export const PhenotypeFilter: Component<{
  fieldMetadata: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  sampleId: string;
}> = (props) => {
  const group: CheckboxGroup = {};
  const nullValue = "__null";

  const onChange = (event: CheckboxEvent) => {
    group[event.value !== undefined ? event.value : nullValue] = event.checked;
    const values = Object.keys(group)
      .filter((key) => group[key])
      .map((key) => (key !== nullValue ? key : null));
    if (values.length > 0) {
      props.onChange({ fieldMetadata: props.fieldMetadata, value: values });
    } else {
      props.onClear({ fieldMetadata: props.fieldMetadata });
    }
  };

  const phenotypesForPatient = () => getHpoTermsForSample(props.sampleId);

  return (
    <Show when={!phenotypes.loading} fallback={<Loader />}>
      <Show when={phenotypesForPatient().length > 0}>
        <>
          <p class="has-text-weight-semibold">Phenotypes</p>
          <div class="field">
            <For each={phenotypesForPatient()}>
              {(category) => (
                <div class="control">
                  <Checkbox value={category.id} label={category.label} onChange={onChange} />
                </div>
              )}
            </For>
          </div>
        </>
      </Show>
    </Show>
  );
};
