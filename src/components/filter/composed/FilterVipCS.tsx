import { Component } from "solid-js";
import { FilterTyped } from "../typed/FilterTyped.tsx";
import { FilterProps, FilterValueChangeCallback } from "../Filter.tsx";
import { ConfigFilterVipCS, FilterValueVipCS } from "../../../types/configFilterComposed";
import { ConfigFilterField, FilterValueCategorical, FilterValueField } from "../../../types/configFilter";

export const FilterVipCS: Component<FilterProps<ConfigFilterVipCS, FilterValueVipCS>> = (props) => {
  return (
    <FilterTyped
      config={props.config as ConfigFilterField}
      value={props.value as FilterValueCategorical}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange as FilterValueChangeCallback<FilterValueField>}
      onValueClear={props.onValueClear}
      isInited={props.isInited}
    />
  );
};
