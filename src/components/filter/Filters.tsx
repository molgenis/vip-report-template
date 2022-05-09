import { Component, For, Match, Switch } from "solid-js";
import { FieldMetadataContainer } from "../../api/vcf/VcfParser";
import { FieldMetadata } from "../../api/vcf/MetadataParser";
import { Filter } from "./Filter";
import { flattenFieldMetadata } from "../../utils/field";
import { VipClass } from "./VipClass";

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
  fields: { [key: string]: string };
}> = (props) => {
  const fieldIds = Object.keys(props.fields);
  const infoMetadataItems = flattenFieldMetadata(props.fieldMetadataContainer)
    .filter((fieldMetadata) => fieldMetadata.type === "CATEGORICAL")
    .filter((fieldMetadata) => fieldIds.length == 0 || fieldIds.includes(fieldMetadata.id));
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
        {(infoMetadata) => (
          <Switch
            fallback={
              <Filter
                label={props.fields[infoMetadata.id]}
                fieldMetadata={infoMetadata}
                onChange={onFilterChange}
                onClear={onFilterClear}
              />
            }
          >
            <Match when={infoMetadata.id === "VIPC"}>
              <VipClass fieldMetadata={infoMetadata} onChange={onFilterChange} onClear={onFilterClear} />
            </Match>
          </Switch>
        )}
      </For>
    </>
  );
};
