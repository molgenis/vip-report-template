import { Component, For } from "solid-js";
import { FieldMetadataContainer } from "../api/vcf/VcfParser";
import { FieldMetadata } from "../api/vcf/MetadataParser";
import { Filter } from "./Filter";
import { flattenFieldMetadata } from "../utils/field";

export type FilterChangeEvent = {
  fieldMetadata: FieldMetadata;
  value: (string | null)[];
};

export type FilterClearEvent = {
  fieldMetadata: FieldMetadata;
};

export type FiltersChangeEvent = {
  filters: FilterChangeEvent[];
};

type Filters = {
  [key: string]: FilterChangeEvent;
};

export const Filters: Component<{
  fieldMetadataContainer: FieldMetadataContainer;
  onChange: (event: FiltersChangeEvent) => void;
}> = (props) => {
  const infoMetadataItems = flattenFieldMetadata(props.fieldMetadataContainer).filter(
    (fieldMetadata) => fieldMetadata.type === "CATEGORICAL"
  );
  const filters: Filters = {};

  const onFilterChange = (event: FilterChangeEvent) => {
    filters[event.fieldMetadata.id] = event;
    props.onChange({ filters: Object.values(filters) });
  };
  const onFilterClear = (event: FilterClearEvent) => {
    delete filters[event.fieldMetadata.id];
    props.onChange({ filters: Object.values(filters) });
  };

  return (
    <>
      <For each={infoMetadataItems}>
        {(infoMetadata) => <Filter fieldMetadata={infoMetadata} onChange={onFilterChange} onClear={onFilterClear} />}
      </For>
    </>
  );
};
