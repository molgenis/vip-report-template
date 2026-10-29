import { Component } from "solid-js";
import { ConfigFilterPick, FilterValuePick } from "../../../types/configFilterComposed";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, FilterValueCategorical } from "../../../types/configFilter";
import { FilterCategorical } from "../typed/FilterCategorical";

export const FilterPick: Component<FilterProps<ConfigFilterPick, FilterValuePick>> = (props) => {
  const config = (): ConfigFilterField => ({
    ...props.config,
    field: {
      ...props.config.field,
      categories: {
        true: {
          label: "True",
          description: "VEP Picked transcript.",
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
