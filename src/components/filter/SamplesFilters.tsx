import { Component, For } from "solid-js";
import { SampleFilters } from "./SampleFilters";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";

export type SampleFields = { sample: Sample; fields: FieldMetadata[] };

export const SamplesFilters: Component<{
  samplesFields: SampleFields[];
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValues: { [key: string]: Value };
}> = (props) => {
  return (
    <>
      <For each={props.samplesFields}>
        {(sampleField) => (
          <SampleFilters
            sample={sampleField.sample}
            fields={sampleField.fields}
            onChange={props.onChange}
            onClear={props.onClear}
            defaultValues={props.defaultValues}
          />
        )}
      </For>
    </>
  );
};
