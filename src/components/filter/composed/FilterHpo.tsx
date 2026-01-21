import { Component } from "solid-js";
import { FilterTyped } from "../typed/FilterTyped.tsx";
import { FilterProps, FilterValueChangeCallback } from "../Filter.tsx";
import { ConfigFilterHpo, FilterValueHpo } from "../../../types/configFilterComposed";
import { FilterValueCategorical, FilterValueField } from "../../../types/configFilter";

export const FilterHpo: Component<FilterProps<ConfigFilterHpo, FilterValueHpo>> = (props) => {
  return (
    <FilterTyped
      config={props.config}
      value={props.value as FilterValueCategorical}
      onValueChange={props.onValueChange as FilterValueChangeCallback<FilterValueField>}
      onValueClear={props.onValueClear}
      isInited={props.isInited}
    />
  );
};
