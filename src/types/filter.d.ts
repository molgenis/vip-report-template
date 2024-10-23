import { FilterId, FilterValue } from "./configFilter";

export type FilterValueMap = { [key: FilterId]: FilterValue };

export interface FilterValueChangeEvent<FilterValueType> {
  value: FilterValueType;
}

export interface FilterChangeEvent extends FilterValueChangeEvent<FilterValue> {
  id: FilterId;
}

export type FilterChangeCallback = (event: FilterChangeEvent) => void;
export type FilterClearEvent = {
  id: FilterId;
};
export type FilterClearCallback = (event: FilterClearEvent) => void;
