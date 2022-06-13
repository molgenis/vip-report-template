import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { InfoFilter } from "./InfoFilter";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export const InfoFilters: Component<{
  fields: FieldMetadata[];
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValues?: { [key: string]: Value };
}> = (props) => {
  const filterableFields = () => props.fields.filter((field) => field.type === "CATEGORICAL");

  return (
    <>
      <For each={filterableFields()}>
        {(field) => (
          <InfoFilter
            field={field}
            onChange={props.onChange}
            onClear={props.onClear}
            defaultValues={props.defaultValues !== undefined ? props.defaultValues[field.id] : undefined}
          />
        )}
      </For>
    </>
  );
};
