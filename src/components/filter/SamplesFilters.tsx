import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { SampleFilterQueries, SampleFilters, SampleFiltersChangeEvent } from "./SampleFilters";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export type SamplesFilterQueries = { [key: number]: SampleFilterQueries };
export type SamplesFiltersChangeEvent = { queries: SamplesFilterQueries };
export type SampleFields = { sample: Sample; fields: FieldMetadata[] };

export const SamplesFilters: Component<{
  samplesFields: SampleFields[];
  onChange: (event: SamplesFiltersChangeEvent) => void;
  defaultValues: { [key: string]: Value };
}> = (props) => {
  const queries: SamplesFilterQueries = {};

  const onFiltersChange = (event: SampleFiltersChangeEvent) => {
    queries[event.sample.index] = event.queries;
    props.onChange({ queries });
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
