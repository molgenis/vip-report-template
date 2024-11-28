import { Component, Match, Switch } from "solid-js";
import { FilterCategorical } from "./FilterCategorical";
import { FilterString } from "./FilterString";
import { FilterInterval } from "./FilterInterval";
import {
  ConfigFilterField,
  FilterValueCategorical,
  FilterValueField,
  FilterValueFlag,
  FilterValueInterval,
  FilterValueString,
} from "../../../types/configFilter";
import { ErrorNotification } from "../../ErrorNotification";
import { FilterFlag } from "./FilterFlag";
import { FilterProps } from "../Filter.tsx";

export const FilterTyped: Component<FilterProps<ConfigFilterField, FilterValueField>> = (props) => {
  const type = () => props.config.field.type;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${type()}`} />}>
      <Match when={type() === "CATEGORICAL"}>
        <FilterCategorical
          config={props.config}
          value={props.value as FilterValueCategorical}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "CHARACTER" || type() === "STRING"}>
        <FilterString
          config={props.config}
          value={props.value as FilterValueString}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "INTEGER" || type() === "FLOAT"}>
        <FilterInterval
          config={props.config}
          value={props.value as FilterValueInterval}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "FLAG"}>
        <FilterFlag
          config={props.config}
          value={props.value as FilterValueFlag}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
