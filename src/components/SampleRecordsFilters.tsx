import { Component, For, Match, Switch } from "solid-js";
import { FilterLocus } from "./filter/custom/FilterLocus";
import { FilterField } from "./filter/FilterField";
import { FilterValueChangeEvent } from "./filter/Filter";
import { ConfigFilterField, FilterId, FilterValue, FilterValueField } from "../types/configFilter";
import { SampleContainer } from "../utils/sample";
import { ConfigFilters } from "../types/config";
import { ConfigFilterCustomLocus, FilterValueLocus } from "../types/configFilterCustom";

export type FilterValueMap = { [key: FilterId]: FilterValue };

export interface FilterChangeEvent extends FilterValueChangeEvent<FilterValue> {
  id: FilterId;
}

export type FilterChangeCallback = (event: FilterChangeEvent) => void;
export type FilterClearEvent = {
  id: FilterId;
};
export type FilterClearCallback = (event: FilterClearEvent) => void;

// TODO refactor: move custom stuff to separate component
export const SampleRecordsFilters: Component<{
  sample: SampleContainer | null;
  filterConfigs: ConfigFilters;
  filterValues: FilterValueMap;
  onFilterChange: FilterChangeCallback;
  onFilterClear: FilterClearCallback;
}> = (props) => {
  return (
    <>
      <For each={props.filterConfigs}>
        {(filter) => (
          <Switch>
            <Match when={filter.type === "format" || filter.type === "info"}>
              <FilterField
                field={(filter as ConfigFilterField).field}
                value={props.filterValues[filter.id] as FilterValueField | undefined}
                onValueChange={(event) => props.onFilterChange({ id: filter.id, ...event })}
                onValueClear={() => props.onFilterClear({ id: filter.id })}
              />
            </Match>
            <Match when={filter.type === "custom"}>
              <Switch>
                <Match when={filter.id === "locus"}>
                  <FilterLocus
                    label={"Locus"}
                    chromosomes={(filter as ConfigFilterCustomLocus).chromosomes}
                    value={props.filterValues[filter.id] as FilterValueLocus | undefined}
                    onValueChange={(event) => props.onFilterChange({ id: filter.id, ...event })}
                    onValueClear={() => props.onFilterClear({ id: filter.id })}
                  />
                </Match>
              </Switch>
            </Match>
          </Switch>
        )}
      </For>
    </>
  );
};
