import { Component, Match, Switch } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { FilterCategorical } from "./FilterCategorical";
import { FilterString } from "./FilterString";
import { FilterInterval } from "./FilterInterval";
import {
  FilterCategory,
  FilterValueCategorical,
  FilterValueField,
  FilterValueFlag,
  FilterValueInterval,
  FilterValueString,
} from "../../../types/configFilter";
import { FilterValueChangeCallback, FilterValueClearCallback } from "../FilterWrapper";
import { ErrorNotification } from "../../ErrorNotification";
import { FilterFlag } from "./FilterFlag";

export const FilterTyped: Component<{
  field: FieldMetadata;
  value?: FilterValueField;
  onValueChange: FilterValueChangeCallback<FilterValueField>;
  onValueClear: FilterValueClearCallback;
}> = (props) => {
  const label = () => props.field.label || props.field.id;
  const tooltip = () => (props.field.description ? <p>{props.field.description}</p> : undefined); // FIXME add categories descriptions
  const categories = (): FilterCategory[] => {
    if (props.field.categories === undefined) throw new Error();

    return (
      Object.entries(props.field.categories)
        .map(([id, value]) => ({
          id,
          label: value.label,
        }))
        .concat(
          !props.field.required
            ? {
                id: "__null",
                label: props.field.nullValue ? props.field.nullValue.label : "Unspecified",
              }
            : [],
        ) || []
    );
  };

  const type = () => props.field.type;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${type()}`} />}>
      <Match when={type() === "CATEGORICAL"}>
        <FilterCategorical
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueCategorical}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
          categories={categories()}
        />
      </Match>
      <Match when={type() === "CHARACTER"}>
        <FilterString
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueString}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "INTEGER"}>
        <FilterInterval
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueInterval}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "FLAG"}>
        <FilterFlag
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueFlag}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "FLOAT"}>
        <FilterInterval
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueInterval}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={type() === "STRING"}>
        <FilterString
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueString}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
