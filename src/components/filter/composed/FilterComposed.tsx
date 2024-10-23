import { Component, Match, Switch } from "solid-js";
import { FilterValue } from "../../../types/configFilter";
import {
  ConfigFilterComposed,
  ConfigFilterHpo,
  ConfigFilterLocus,
  FilterValueHpo,
  FilterValueLocus,
} from "../../../types/configFilterComposed";
import { FilterLocus } from "./FilterLocus";
import { ErrorNotification } from "../../ErrorNotification";
import { FilterHpo } from "./FilterHpo.tsx";
import { FilterProps } from "../Filter.tsx";

export const FilterComposed: Component<FilterProps<ConfigFilterComposed, FilterValue>> = (props) => {
  const id = () => props.config.id;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${id()}`} />}>
      <Match when={id() === "hpo"}>
        <FilterHpo
          config={props.config as ConfigFilterHpo}
          value={props.value as FilterValueHpo | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "locus"}>
        <FilterLocus
          config={props.config as ConfigFilterLocus}
          value={props.value as FilterValueLocus | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
