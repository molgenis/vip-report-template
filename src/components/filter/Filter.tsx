import { Component, Match, Switch } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterCategorical } from "./FilterCategorical";
import { FilterIntegerVim } from "./FilterIntegerVim";
import { FilterIntegerDp } from "./FilterIntegerDp";
import { FilterIntegerVid } from "./FilterIntegerVid";
import { QueryClause, Selector } from "@molgenis/vip-report-api/src/Api";
import { FilterClinVar } from "./FilterClinVar";

export type FilterChangeEvent = { query: QueryClause };
export type FilterClearEvent = { selector: Selector };

export const Filter: Component<{
  field: FieldMetadata;
  query?: QueryClause;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const onChange = (event: FilterChangeEvent) => props.onChange(event);
  const onClear = (event: FilterClearEvent) => props.onClear(event);

  return (
    <Switch>
      <Match when={props.field.id === "DP"}>
        <FilterIntegerDp field={props.field} onChange={onChange} onClear={onClear} query={props.query} />
      </Match>
      <Match when={props.field.id === "VID"}>
        <FilterIntegerVid field={props.field} onChange={onChange} onClear={onClear} query={props.query} />
      </Match>
      <Match when={props.field.id === "VIM"}>
        <FilterIntegerVim field={props.field} onChange={onChange} onClear={onClear} query={props.query} />
      </Match>
      <Match when={props.field.id === "clinVar_CLNSIG" && props.field.parent?.id === "CSQ"}>
        <FilterClinVar field={props.field} onChange={onChange} onClear={onClear} query={props.query} />
      </Match>
      <Match when={props.field.type === "CATEGORICAL"}>
        <FilterCategorical field={props.field} onChange={onChange} onClear={onClear} query={props.query} />
      </Match>
    </Switch>
  );
};
