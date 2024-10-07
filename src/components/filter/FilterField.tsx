import { Component, Match, Switch } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterValueChangeCallback, FilterValueClearCallback } from "./Filter";
import { FilterCategorical } from "./FilterCategorical";
import { FilterString } from "./FilterString";
import { FilterInterval } from "./FilterInterval";
import {
  FilterCategory,
  FilterValueCategorical,
  FilterValueField,
  FilterValueInterval,
  FilterValueString,
} from "../../types/configFilter";

export const FilterField: Component<{
  field: FieldMetadata;
  value?: FilterValueField;
  onValueChange: FilterValueChangeCallback<FilterValueField>;
  onValueClear: FilterValueClearCallback;
}> = (props) => {
  const label = () => props.field.label || props.field.id;
  const tooltip = () => (props.field.description ? <p>{props.field.description}</p> : undefined);
  const categories = (): FilterCategory[] =>
    props.field.categories
      ?.map((category) => ({ id: category, label: category }))
      .concat(!props.field.required ? { id: "__null", label: "Unspecified" } : []) || [];

  return (
    <Switch>
      <Match when={props.field.type === "CATEGORICAL"}>
        <FilterCategorical
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueCategorical}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
          categories={categories()}
        />
      </Match>
      <Match when={props.field.type === "CHARACTER"}>
        <FilterString
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueString}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={props.field.type === "INTEGER"}>
        <FilterInterval
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueInterval}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={props.field.type === "FLAG"}>
        <FilterCategorical
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueCategorical}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
          categories={[
            { id: "true", label: "True" },
            { id: "false", label: "False" },
          ]}
        />
      </Match>
      <Match when={props.field.type === "FLOAT"}>
        <FilterInterval
          label={label()}
          tooltip={tooltip()}
          value={props.value as FilterValueInterval}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={props.field.type === "STRING"}>
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
