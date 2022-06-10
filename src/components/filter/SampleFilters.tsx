import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { Filter, FilterChangeEvent, FilterClearEvent, FilterQuery } from "./Filter";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export type SampleFilterQuery = { sample: Sample; query: FilterQuery };
export type SampleFilterQueries = { [key: string]: SampleFilterQuery };
export type SampleFiltersChangeEvent = { sample: Sample; queries: SampleFilterQueries };

export const SampleFilters: Component<{
  sample: Sample;
  fields: FieldMetadata[];
  onChange: (event: SampleFiltersChangeEvent) => void;
  defaultValues: { [key: string]: Value };
}> = (props) => {
  const queries: SampleFilterQueries = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFiltersChange = () => props.onChange({ sample: props.sample, queries });

  const onFilterChange = (event: FilterChangeEvent) => {
    queries[event.query.field.id] = { sample: props.sample, query: event.query };
    onFiltersChange();
  };
  const onFilterClear = (event: FilterClearEvent) => {
    delete queries[event.field.id];
    onFiltersChange();
  };

  return (
    <>
      <p class="has-text-weight-semibold">{props.sample.person.individualId}</p>
      <div class="field">
        <For each={props.fields}>
          {(field) => (
            <Filter
              field={field}
              onChange={onFilterChange}
              onClear={onFilterClear}
              defaultValue={props.defaultValues[field.id]}
            />
          )}
        </For>
      </div>
    </>
  );
};
