import { Component, Match, Switch } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterCategorical } from "./FilterCategorical";
import { FilterIntegerVim } from "./FilterIntegerVim";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FilterIntegerDp } from "./FilterIntegerDp";
import { FilterIntegerVid } from "./FilterIntegerVid";
import { QueryOperator } from "@molgenis/vip-report-api/src/Api";

export type FilterChangeEvent = {
  field: FieldMetadata;
  operator: QueryOperator;
  value: Value;
};

export type FilterClearEvent = {
  field: FieldMetadata;
};

export const Filter: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  return (
    <Switch>
      <Match when={props.field.id === "DP"}>
        <FilterIntegerDp field={props.field} onChange={props.onChange} onClear={props.onClear} />
      </Match>
      <Match when={props.field.id === "VID"}>
        <FilterIntegerVid field={props.field} onChange={props.onChange} onClear={props.onClear} />
      </Match>
      <Match when={props.field.id === "VIM"}>
        <FilterIntegerVim field={props.field} onChange={props.onChange} onClear={props.onClear} />
      </Match>
      <Match when={props.field.type === "CATEGORICAL"}>
        <FilterCategorical field={props.field} onChange={props.onChange} onClear={props.onClear} />
      </Match>
    </Switch>
  );
};
