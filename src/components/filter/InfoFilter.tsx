import { Component } from "solid-js";
import { Filter, FilterChangeEvent, FilterClearEvent, FilterProps } from "./Filter";
import { SelectorPart } from "@molgenis/vip-report-api/src/Api";

export const InfoFilter: Component<FilterProps> = (props) => {
  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);

  const onChange = (event: FilterChangeEvent) => {
    props.onChange({
      query: { ...event.query, selector: ["n", ...(event.query.selector as SelectorPart[])] },
    });
  };

  const onClear = (event: FilterClearEvent) => {
    props.onClear({
      selector: ["n", ...(event.selector as SelectorPart[])],
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
