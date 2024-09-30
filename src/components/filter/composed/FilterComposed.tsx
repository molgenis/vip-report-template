import { Component, Match, Switch } from "solid-js";
import { FilterValue } from "../../../types/configFilter";
import { FilterValueChangeCallback, FilterValueClearCallback } from "../FilterWrapper";
import {
  ConfigFilterComposed,
  ConfigFilterHpo,
  ConfigFilterLocus,
  FilterValueComposed,
  FilterValueHpo,
  FilterValueLocus,
} from "../../../types/configFilterComposed";
import { FilterLocus } from "./FilterLocus";
import { ErrorNotification } from "../../ErrorNotification";
import { FilterHpo } from "./FilterHpo.tsx";

export const FilterComposed: Component<{
  config: ConfigFilterComposed;
  value?: FilterValueComposed;
  onValueChange: FilterValueChangeCallback<FilterValue>;
  onValueClear: FilterValueClearCallback;
}> = (props) => {
  const id = () => props.config.id;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${id()}`} />}>
      <Match when={id() === "hpo"}>
        <FilterHpo
          label={"Phenotypes"}
          value={props.value as FilterValueHpo | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
          {...(props.config as ConfigFilterHpo)}
        />
      </Match>
      <Match when={id() === "locus"}>
        <FilterLocus
          label={"Locus"}
          value={props.value as FilterValueLocus | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
          {...(props.config as ConfigFilterLocus)}
        />
      </Match>
    </Switch>
  );
};
