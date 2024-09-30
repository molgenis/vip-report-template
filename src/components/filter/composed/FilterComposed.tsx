import { Component, Match, Switch } from "solid-js";
import { FilterValue } from "../../../types/configFilter";
import { FilterValueChangeCallback, FilterValueClearCallback } from "../FilterWrapper";
import {
  ConfigFilterComposed,
  ConfigFilterLocus,
  FilterValueComposed,
  FilterValueLocus,
} from "../../../types/configFilterComposed";
import { FilterLocus } from "./FilterLocus";
import { ErrorNotification } from "../../ErrorNotification";

export const FilterComposed: Component<{
  config: ConfigFilterComposed;
  value?: FilterValueComposed;
  onValueChange: FilterValueChangeCallback<FilterValue>;
  onValueClear: FilterValueClearCallback;
}> = (props) => {
  const id = () => props.config.id;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${id()}`} />}>
      <Match when={id() === "locus"}>
        <FilterLocus
          label={"Locus"}
          chromosomes={(props.config as ConfigFilterLocus).chromosomes}
          value={props.value as FilterValueLocus | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
