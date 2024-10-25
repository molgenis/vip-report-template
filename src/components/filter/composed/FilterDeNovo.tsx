import { Component } from "solid-js";
import { ConfigFilterDeNovo, FilterValueDeNovo } from "../../../types/configFilterComposed";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, FilterValueCategorical } from "../../../types/configFilter";
import { FilterCategorical } from "../typed/FilterCategorical";

export const FilterDeNovo: Component<FilterProps<ConfigFilterDeNovo, FilterValueDeNovo>> = (props) => {
  const config = (): ConfigFilterField => ({
    ...props.config,
    field: {
      ...props.config.vidField,
      categories: { true: { label: "True" }, potential: { label: "Potential" }, false: { label: "False" } },
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
