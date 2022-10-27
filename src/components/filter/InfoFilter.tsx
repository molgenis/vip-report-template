import { Component } from "solid-js";
import { Filter, FilterProps } from "./Filter";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";
import { QueryClause, SelectorPart } from "@molgenis/vip-report-api/src/Api";
import { selectorKey } from "../../utils/query";

export const InfoFilter: Component<FilterProps> = (props) => {
  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);

  const onChange = (event: FilterChangeEvent) => {
    props.onChange({
      key: selectorKey(["n", event.key]),
      query: {
        ...(event.query as QueryClause),
        selector: ["n", ...((event.query as QueryClause).selector as SelectorPart[])],
      },
    });
  };

  const onClear = (event: FilterClearEvent) => {
    props.onClear({
      key: selectorKey(["n", event.key]),
    });
  };

  return (
    <>
      <p class="has-text-weight-semibold">
        {props.field.description ? <abbr title={props.field.description}>{label()}</abbr> : <span>{label()}</span>}
      </p>
      <div class="field">
        <Filter field={props.field} query={props.query} onChange={onChange} onClear={onClear} />
      </div>
    </>
  );
};
