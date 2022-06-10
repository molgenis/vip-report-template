import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent, FilterQuery } from "./Filter";
import { InfoFilter } from "./InfoFilter";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export type InfoFilterQueries = { [key: string]: FilterQuery };

export type InfoFiltersChangeEvent = {
  queries: InfoFilterQueries;
};

export const InfoFilters: Component<{
  fields: FieldMetadata[];
  onChange: (event: InfoFiltersChangeEvent) => void;
  defaultValues?: { [key: string]: Value };
}> = (props) => {
  const filterableFields = () => props.fields.filter((field) => field.type === "CATEGORICAL");

  const queries: InfoFilterQueries = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFiltersChange = () => props.onChange({ queries });

  const onFilterChange = (event: FilterChangeEvent) => {
    queries[event.query.field.id] = event.query;
    onFiltersChange();
  };
  const onFilterClear = (event: FilterClearEvent) => {
    delete queries[event.field.id];
    onFiltersChange();
  };

  return (
    <>
      <For each={filterableFields()}>
        {(field) => (
          <InfoFilter
            field={field}
            onChange={onFilterChange}
            onClear={onFilterClear}
            defaultValues={props.defaultValues !== undefined ? props.defaultValues[field.id] : undefined}
          />
        )}
      </For>
    </>
  );
};
