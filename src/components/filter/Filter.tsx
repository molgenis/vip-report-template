import { Component, Match, Switch } from "solid-js";
import {
  ConfigFilter,
  ConfigFilterBase,
  ConfigFilterField,
  ConfigFilterFixed,
  FilterValue,
  FilterValueField,
  FilterValueFixed,
} from "../../types/configFilter";
import { FilterTyped } from "./typed/FilterTyped";
import { ConfigFilterComposed, FilterValueComposed } from "../../types/configFilterComposed";
import { FilterComposed } from "./composed/FilterComposed";
import { ErrorNotification } from "../ErrorNotification";
import { FilterFixed } from "./fixed/FilterFixed.tsx";

export interface FilterValueChangeEvent<FilterValueType> {
  value: FilterValueType;
}

export type FilterValueChangeCallback<FilterValueType> = (event: FilterValueChangeEvent<FilterValueType>) => void;
export type FilterValueClearCallback = () => void;

export interface FilterProps<C extends ConfigFilterBase, FilterValueType> {
  config: C;
  value?: FilterValueType;
  defaultValue?: string | string[] | number | number[] | boolean;
  onValueChange: FilterValueChangeCallback<FilterValueType>;
  onValueClear: FilterValueClearCallback;
}

export const Filter: Component<FilterProps<ConfigFilter, FilterValue>> = (props) => {
  const type = () => props.config.type;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${type()}`} />}>
      <Match when={type() === "fixed"}>
        <FilterFixed
          config={props.config as ConfigFilterFixed}
          value={props.value as FilterValueFixed}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "info" || type() === "genotype"}>
        <FilterTyped
          config={props.config as ConfigFilterField}
          value={props.value as FilterValueField}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "composed"}>
        <FilterComposed
          config={props.config as ConfigFilterComposed}
          value={props.value as FilterValueComposed}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
