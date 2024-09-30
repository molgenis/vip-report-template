import { Component, Match, Switch } from "solid-js";
import { CategoryRecord, FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { FilterCategorical } from "./FilterCategorical";
import { FilterString } from "./FilterString";
import { FilterInterval } from "./FilterInterval";
import {
  FilterValueCategorical,
  FilterValueField,
  FilterValueFlag,
  FilterValueInterval,
  FilterValueString,
} from "../../../types/configFilter";
import { FilterValueChangeCallback, FilterValueClearCallback } from "../FilterWrapper";
import { ErrorNotification } from "../../ErrorNotification";
import { FilterFlag } from "./FilterFlag";
import { Tooltip } from "../../Tooltip.tsx";

export type FilterTypedProps = {
  field: FieldMetadata;
  value?: FilterValueField;
  onValueChange: FilterValueChangeCallback<FilterValueField>;
  onValueClear: FilterValueClearCallback;
};

export const FilterTyped: Component<FilterTypedProps> = (props) => {
  const label = () => props.field.label || props.field.id;
  const tooltip = () => (props.field.description ? <Tooltip text={props.field.description} /> : undefined);
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
          categories={props.field.categories as CategoryRecord}
          nullCategory={props.field.required ? undefined : props.field.nullValue || null}
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
