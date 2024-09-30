import { Component, Match, Switch } from "solid-js";
import { FilterValueChangeCallback, FilterValueClearCallback } from "./FilterWrapper";
import { ConfigFilter, ConfigFilterField, FilterValue, FilterValueField } from "../../types/configFilter";
import { FilterTyped } from "./typed/FilterTyped";
import { ConfigFilterComposed, FilterValueComposed } from "../../types/configFilterComposed";
import { FilterComposed } from "./composed/FilterComposed";
import { ErrorNotification } from "../ErrorNotification";

export const Filter: Component<{
  config: ConfigFilter;
  value?: FilterValueField;
  onValueChange: FilterValueChangeCallback<FilterValue>;
  onValueClear: FilterValueClearCallback;
}> = (props) => {
  const type = () => props.config.type;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${type()}`} />}>
      <Match when={type() === "info" || type() === "genotype"}>
        <FilterTyped
          field={(props.config as ConfigFilterField).field}
          value={props.value as FilterValueField | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "composed"}>
        <FilterComposed
          config={props.config as ConfigFilterComposed}
          value={props.value as FilterValueComposed | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
