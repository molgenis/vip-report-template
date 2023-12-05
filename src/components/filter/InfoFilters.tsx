import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { InfoFilter } from "./InfoFilter";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FilterQueries } from "../../store";
import { infoFieldKey } from "../../utils/query";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";

export const InfoFilters: Component<{
  fields: FieldMetadata[];
  queries?: FilterQueries;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValues?: { [key: string]: Value };
}> = (props) => {
  const filterableFields = () =>
    props.fields.filter(
      (field) => field.type === "CATEGORICAL" || field.id === "IncompletePenetrance" || field.id === "SVTYPE",
    );

  return (
    <>
      <For each={filterableFields()}>
        {(field) => (
          <InfoFilter
            field={field}
            query={props.queries ? props.queries[infoFieldKey(field)] : undefined}
            onChange={props.onChange}
            onClear={props.onClear}
          />
        )}
      </For>
    </>
  );
};
