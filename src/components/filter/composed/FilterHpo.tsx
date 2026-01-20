import { Component } from "solid-js";
import { FilterTyped } from "../typed/FilterTyped.tsx";
import { FilterProps, FilterValueChangeCallback } from "../Filter.tsx";
import { ConfigFilterHpo, FilterValueHpo } from "../../../types/configFilterComposed";
import { ConfigFilterField, FilterValueCategorical, FilterValueField } from "../../../types/configFilter";

export const FilterHpo: Component<FilterProps<ConfigFilterHpo, FilterValueHpo>> = (props) => {
  const config = (): ConfigFilterField => {
    const config = props.config;
    if (config.defaultValue === "select all") {
      config.defaultValue = Object.keys(config.field.categories!).join(",");
    }
    return config;
  };

  return (
    <FilterTyped
      config={config()}
      value={props.value as FilterValueCategorical}
      onValueChange={props.onValueChange as FilterValueChangeCallback<FilterValueField>}
      onValueClear={props.onValueClear}
      isInited={props.isInited}
    />
  );
};
