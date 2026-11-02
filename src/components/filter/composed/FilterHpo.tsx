import { Component, createMemo } from "solid-js";
import { FilterTyped } from "../typed/FilterTyped.tsx";
import { FilterProps, FilterValueChangeCallback } from "../Filter.tsx";
import { ConfigFilterHpo, FilterValueHpo } from "../../../types/configFilterComposed";
import { FilterValueCategorical, FilterValueField } from "../../../types/configFilter";

export const FilterHpo: Component<FilterProps<ConfigFilterHpo, FilterValueHpo>> = (props) => {
  const config = createMemo(() => ({
    showComposedOperator: true,
    ...props.config,
  }));

  return (
    <FilterTyped
      config={config() as ConfigFilterHpo}
      value={props.value as FilterValueCategorical}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange as FilterValueChangeCallback<FilterValueField>}
      onValueClear={props.onValueClear}
      isInited={props.isInited}
    />
  );
};
