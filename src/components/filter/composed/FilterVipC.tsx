import { Component } from "solid-js";
import { FilterTyped } from "../typed/FilterTyped.tsx";
import { FilterProps, FilterValueChangeCallback } from "../Filter.tsx";
import { ConfigFilterVipC, FilterValueVipC } from "../../../types/configFilterComposed";
import { ConfigFilterField, FilterValueCategorical, FilterValueField } from "../../../types/configFilter";

export const FilterVipC: Component<FilterProps<ConfigFilterVipC, FilterValueVipC>> = (props) => {
  return (
    <FilterTyped
      config={props.config as ConfigFilterField}
      value={props.value as FilterValueCategorical}
      onValueChange={props.onValueChange as FilterValueChangeCallback<FilterValueField>}
      onValueClear={props.onValueClear}
    />
  );
};
