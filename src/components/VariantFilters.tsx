import { Component, For } from "solid-js";
import { FilterValueField } from "../types/configFilter";
import { ConfigFilters } from "../types/config";
import { FilterChangeCallback, FilterClearCallback, FilterValueMap } from "../types/filter";
import { Filter } from "./filter/Filter";

export const VariantFilters: Component<{
  filterConfigs: ConfigFilters;
  filterValues: FilterValueMap;
  onFilterChange: FilterChangeCallback;
  onFilterClear: FilterClearCallback;
  filtersInited: boolean;
}> = (props) => {
  return (
    <For each={props.filterConfigs}>
      {(filter) => (
        <Filter
          config={filter}
          value={props.filterValues[filter.id] as FilterValueField | undefined}
          onValueChange={(event) => props.onFilterChange({ id: filter.id, ...event })}
          onValueClear={() => props.onFilterClear({ id: filter.id })}
          isInited={props.filtersInited}
        />
      )}
    </For>
  );
};
