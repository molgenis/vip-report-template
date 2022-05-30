import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { Filter, FilterChangeEvent, FilterClearEvent } from "./Filter";

export type SampleFiltersChangeEvent = {
  sample: Sample;
  filters: FilterChangeEvent[];
};

export const SampleFilters: Component<{
  sample: Sample;
  fields: FieldMetadata[];
  onChange: (event: SampleFiltersChangeEvent) => void;
}> = (props) => {
  const filters: { [key: string]: FilterChangeEvent } = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFiltersChange = () => props.onChange({ sample: props.sample, filters: Object.values(filters) });

  const onFilterChange = (event: FilterChangeEvent) => {
    filters[event.field.id] = event;
    onFiltersChange();
  };
  const onFilterClear = (event: FilterClearEvent) => {
    delete filters[event.field.id];
    onFiltersChange();
  };

  return (
    <>
      <p class="has-text-weight-semibold">{props.sample.person.individualId}</p>
      <div class="field">
        <For each={props.fields}>
          {(field) => <Filter field={field} onChange={onFilterChange} onClear={onFilterClear} />}
        </For>
      </div>
    </>
  );
};
