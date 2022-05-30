import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { InfoFilter } from "./InfoFilter";

export type InfoFiltersChangeEvent = {
  filters: FilterChangeEvent[];
};

export const InfoFilters: Component<{
  fields: FieldMetadata[];
  onChange: (event: InfoFiltersChangeEvent) => void;
}> = (props) => {
  const filterableFields = () => props.fields.filter((field) => field.type === "CATEGORICAL");

  const filters: { [key: string]: FilterChangeEvent } = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFiltersChange = () => props.onChange({ filters: Object.values(filters) });

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
      <For each={filterableFields()}>
        {(field) => <InfoFilter field={field} onChange={onFilterChange} onClear={onFilterClear} />}
      </For>
    </>
  );
};
