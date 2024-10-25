import { Component } from "solid-js";
import { ConfigFilterInheritanceMatch, FilterValueInheritanceMatch } from "../../../types/configFilterComposed";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, FilterValueCategorical } from "../../../types/configFilter";
import { FilterCategorical } from "../typed/FilterCategorical";

export const FilterInheritance: Component<FilterProps<ConfigFilterInheritanceMatch, FilterValueInheritanceMatch>> = (
  props,
) => {
  const config = (): ConfigFilterField => ({
    ...props.config,
    field: {
      ...props.config.vimField,
      categories: { true: { label: "Match" }, potential: { label: "Potential match" }, false: { label: "No Match" } },
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
