import { Component, For } from "solid-js";
import { SampleFilters } from "./SampleFilters";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { FilterQueries } from "../../store";

export type SampleFields = { sample: Sample; fields: FieldMetadata[] };

export const SamplesFilters: Component<{
  samplesFields: SampleFields[];
  queries?: FilterQueries;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  return (
    <>
      <For each={props.samplesFields}>
        {(sampleField) => (
          <SampleFilters
            sample={sampleField.sample}
            fields={sampleField.fields}
            queries={props.queries}
            onChange={props.onChange}
            onClear={props.onClear}
          />
        )}
      </For>
    </>
  );
};
