import { Component } from "solid-js";
import { ConfigFilterAllelicImbalance, FilterValueAllelicImbalance } from "../../../types/configFilterComposed";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, FilterValueCategorical } from "../../../types/configFilter";
import { FilterCategorical } from "../typed/FilterCategorical";

export const FilterAllelicImbalance: Component<
  FilterProps<ConfigFilterAllelicImbalance, FilterValueAllelicImbalance>
> = (props) => {
  const config = (): ConfigFilterField => ({
    ...props.config,
    field: {
      ...props.config.viabField,
      categories: { true: { label: "True" }, false: { label: "False" } },
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
