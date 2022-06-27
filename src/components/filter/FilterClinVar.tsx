import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { FilterCategorical } from "./FilterCategorical";

export const FilterClinVar: Component<FilterProps> = (props) => {
  return (
    <FilterCategorical
      field={props.field}
      labels={{
        Benign: "B",
        Likely_benign: "LB",
        Uncertain_significance: "VUS",
        Likely_pathogenic: "LP",
        Pathogenic: "P",
        Conflicting_interpretations_of_pathogenicity: "Conflict",
      }}
      onChange={props.onChange}
      onClear={props.onClear}
    />
  );
};
