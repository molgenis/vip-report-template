import { Component } from "solid-js";
import { FilterTyped } from "../typed/FilterTyped.tsx";
import { FilterProps, FilterValueChangeCallback } from "../Filter.tsx";
import { ConfigFilterHpo, FilterValueHpo } from "../../../types/configFilterComposed";
import { ConfigFilterField, FilterValueCategorical, FilterValueField } from "../../../types/configFilter";

export const FilterHpo: Component<FilterProps<ConfigFilterHpo, FilterValueHpo>> = (props) => {
  return (
    <FilterTyped
      config={props.config as ConfigFilterField}
      value={props.value as FilterValueCategorical}
      onValueChange={props.onValueChange as FilterValueChangeCallback<FilterValueField>}
      onValueClear={props.onValueClear}
    />
  );
};
