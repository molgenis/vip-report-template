import { Component, For, Match, Switch } from "solid-js";
import { FilterLocus } from "./filter/FilterLocus";
import { FilterField } from "./filter/vcf/FilterField";
import { SampleContainer } from "../utils/ApiUtils";
import { FilterValueChangeEvent } from "./filter/Filter";
import {
  FilterConfig,
  FilterConfigCustomLocus,
  FilterConfigField,
  FilterId,
  FilterValue,
  FilterValueField,
  FilterValueLocus,
} from "../types/filter";

export type FilterValueMap = { [key: FilterId]: FilterValue };
export interface FilterChangeEvent extends FilterValueChangeEvent<FilterValue> {
  id: FilterId;
}
export type FilterChangeCallback = (event: FilterChangeEvent) => void;
export type FilterClearEvent = {
  id: FilterId;
};
export type FilterClearCallback = (event: FilterClearEvent) => void;

export const SampleRecordsFilters: Component<{
  sample: SampleContainer | null;
  filters: FilterConfig[];
  filtersValue: FilterValueMap;
  onFilterChange: FilterChangeCallback;
  onFilterClear: FilterClearCallback;
}> = (props) => {
  return (
    <>
      <For each={props.filters}>
        {(filter) => (
          <Switch>
            <Match when={filter.type === "format" || filter.type === "info"}>
              <FilterField
                field={(filter as FilterConfigField).field}
                value={props.filtersValue[filter.id] as FilterValueField | undefined}
                onValueChange={(event) => props.onFilterChange({ id: filter.id, ...event })}
                onValueClear={() => props.onFilterClear({ id: filter.id })}
              />
            </Match>
            <Match when={filter.type === "custom"}>
              <Switch>
                <Match when={filter.id === "custom/locus"}>
                  <FilterLocus
                    label={"Locus"}
                    chromosomes={(filter as FilterConfigCustomLocus).chromosomes}
                    value={props.filtersValue[filter.id] as FilterValueLocus | undefined}
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
