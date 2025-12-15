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
      categories: {
        true: {
          label: "Match",
          description:
            "The inheritance pattern of the sample and its family members matches the known patterns of the gene associated with the variant.",
        },
        potential: {
          label: "Potential match",
          description:
            "The match between the inheritance patterns of the sample and its family members and the known patterns of the gene associated with the variant cannot be determined with certainty. e.g. due to missing affected status of samples, missing genotypes or lack of known patterns for the gene.",
        },
        false: {
          label: "No Match",
          description:
            "The inheritance pattern of the sample and its family members does not match the known patterns of the gene associated with the variant.",
        },
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
      isInited={props.isInited}
    />
  );
};
