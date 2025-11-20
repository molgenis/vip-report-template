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
      categories: {
        true: {
          label: "True",
          description: "At least one allele of the sample genotype is not inherited from a parent.",
        },
        potential: {
          label: "Potential",
          description:
            "Denovo status cannot be determined, e.g. due to missing parent(s) or (partially) missing genotypes.",
        },
        false: { label: "False", description: "The entire sample genotype is inherited from their parents." },
      },
    },
  });

  return (
    <FilterCategorical
      config={config()}
      value={props.value as FilterValueCategorical}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
      onValueClear={props.onValueClear}
    />
  );
};
