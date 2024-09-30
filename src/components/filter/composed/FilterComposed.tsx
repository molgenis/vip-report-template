import { Component, Match, Switch } from "solid-js";
import { FilterValue } from "../../../types/configFilter";
import {
  ConfigFilterAllelicImbalance,
  ConfigFilterComposed,
  ConfigFilterDeNovo,
  ConfigFilterHpo,
  ConfigFilterInheritanceMatch,
  ConfigFilterLocus,
  FilterValueAllelicImbalance,
  FilterValueDeNovo,
  FilterValueHpo,
  FilterValueInheritanceMatch,
  FilterValueLocus,
} from "../../../types/configFilterComposed";
import { FilterLocus } from "./FilterLocus";
import { ErrorNotification } from "../../ErrorNotification";
import { FilterHpo } from "./FilterHpo.tsx";
import { FilterProps } from "../Filter.tsx";
import { FilterAllelicImbalance } from "./FilterAllelicImbalance";
import { FilterInheritance } from "./FilterInheritance.tsx";
import { FilterDeNovo } from "./FilterDeNovo.tsx";

export const FilterComposed: Component<FilterProps<ConfigFilterComposed, FilterValue>> = (props) => {
  const id = () => props.config.id;
  return (
    <Switch fallback={<ErrorNotification error={`unexpected field id ${id()}`} />}>
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
      <Match when={id() === "allelicImbalance"}>
        <FilterAllelicImbalance
          config={props.config as ConfigFilterAllelicImbalance}
          value={props.value as FilterValueAllelicImbalance | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "inheritanceMatch"}>
        <FilterInheritance
          config={props.config as ConfigFilterInheritanceMatch}
          value={props.value as FilterValueInheritanceMatch | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "deNovo"}>
        <FilterDeNovo
          config={props.config as ConfigFilterDeNovo}
          value={props.value as FilterValueDeNovo | undefined}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
