import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Filter } from "./Filter";

export type FilterChangeEvent = {
  field: FieldMetadata;
  value: (string | null)[];
};

export type FilterClearEvent = {
  field: FieldMetadata;
};

export type FiltersChangeEvent = {
  filters: FilterChangeEvent[];
};

export const Filters: Component<{
  fields: FieldMetadata[];
  onChange: (event: FiltersChangeEvent) => void;
}> = (props) => {
  const filterableFields = () => props.fields.filter((field) => field.type === "CATEGORICAL");

  const filters: { [key: string]: FilterChangeEvent } = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFilterChange = (event: FilterChangeEvent) => {
    filters[event.field.id] = event;
    props.onChange({ filters: Object.values(filters) });
  };
  const onFilterClear = (event: FilterClearEvent) => {
    delete filters[event.field.id];
    props.onChange({ filters: Object.values(filters) });
  };

  return (
    <>
      <For each={filterableFields()}>
        {(field) => <Filter field={field} onChange={onFilterChange} onClear={onFilterClear} />}
      </For>
    </>
  );
};
