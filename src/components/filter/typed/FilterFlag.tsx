import { Component } from "solid-js";
import { FilterCategorical } from "./FilterCategorical";
import { FilterCategory, FilterValueCategorical } from "../../../types/configFilter";
import { FilterTypedProps } from "../FilterWrapper";

export const FilterFlag: Component<FilterTypedProps<FilterValueCategorical>> = (props) => {
  const categories: FilterCategory[] = [
    { id: "true", label: "True" },
    { id: "false", label: "False" },
  ];

  return (
    <FilterCategorical
      label={props.label}
      tooltip={props.tooltip}
      value={props.value as FilterValueCategorical}
      onValueChange={props.onValueChange}
      onValueClear={props.onValueClear}
      categories={categories}
    />
  );
};
