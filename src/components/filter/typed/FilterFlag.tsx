import { Component } from "solid-js";
import { FilterCategorical } from "./FilterCategorical";
import { ConfigFilterField, FilterValueCategorical, FilterValueFlag } from "../../../types/configFilter";
import { FilterProps } from "../Filter.tsx";

export const FilterFlag: Component<FilterProps<ConfigFilterField, FilterValueFlag>> = (props) => {
  const config = (): ConfigFilterField => ({
    ...props.config,
    field: {
      ...props.config.field,
      categories: { true: { label: "True" }, false: { label: "False" } },
    },
  });

  return (
    <FilterCategorical
      config={config()}
      value={props.value as FilterValueCategorical}
      onValueChange={props.onValueChange}
      onValueClear={props.onValueClear}
    />
  );
};
