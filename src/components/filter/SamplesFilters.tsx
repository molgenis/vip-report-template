import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { FilterChangeEvent } from "./Filter";
import { SampleFilters } from "./SampleFilters";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export type SampleFiltersChangeEvent = {
  sample: Sample;
  filters: FilterChangeEvent[];
};

export type SampleFields = { sample: Sample; fields: FieldMetadata[] };

export type SamplesFiltersChangeEvent = {
  filters: SampleFiltersChangeEvent[];
};

export const SamplesFilters: Component<{
  samplesFields: SampleFields[];
  onChange: (event: SamplesFiltersChangeEvent) => void;
  defaultValues: { [key: string]: Value };
}> = (props) => {
  const filters: { [key: number]: SampleFiltersChangeEvent } = {};

  const onFiltersChange = (event: SampleFiltersChangeEvent) => {
    filters[event.sample.index] = event;
    props.onChange({ filters: Object.values(filters) });
  };

  return (
    <>
      <For each={props.samplesFields}>
        {(sampleField) => (
          <SampleFilters
            sample={sampleField.sample}
            fields={sampleField.fields}
            onChange={onFiltersChange}
            defaultValues={props.defaultValues}
          />
        )}
      </For>
    </>
  );
};
