import { Component, Match, Switch } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterCategorical } from "./FilterCategorical";
import { FilterIntegerVim } from "./FilterIntegerVim";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FilterIntegerDp } from "./FilterIntegerDp";
import { FilterIntegerVid } from "./FilterIntegerVid";
import { QueryClause, Selector } from "@molgenis/vip-report-api/src/Api";

export type FilterChangeEvent = { query: QueryClause };
export type FilterClearEvent = { selector: Selector };

export const Filter: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValue: Value | undefined;
}> = (props) => {
  return (
    <Switch>
      <Match when={props.field.id === "DP"}>
        <FilterIntegerDp
          field={props.field}
          onChange={props.onChange}
          onClear={props.onClear}
          defaultValue={props.defaultValue}
        />
      </Match>
      <Match when={props.field.id === "VID"}>
        <FilterIntegerVid
          field={props.field}
          onChange={props.onChange}
          onClear={props.onClear}
          defaultValue={props.defaultValue}
        />
      </Match>
      <Match when={props.field.id === "VIM"}>
        <FilterIntegerVim
          field={props.field}
          onChange={props.onChange}
          onClear={props.onClear}
          defaultValue={props.defaultValue}
        />
      </Match>
      <Match when={props.field.type === "CATEGORICAL"}>
        <FilterCategorical
          field={props.field}
          onChange={props.onChange}
          onClear={props.onClear}
          defaultValues={props.defaultValue}
        />
      </Match>
    </Switch>
  );
};
