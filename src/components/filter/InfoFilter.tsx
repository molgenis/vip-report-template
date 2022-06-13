import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Filter, FilterChangeEvent, FilterClearEvent } from "./Filter";
import { QueryClause } from "@molgenis/vip-report-api/src/Api";

export const InfoFilter: Component<{
  field: FieldMetadata;
  query?: QueryClause;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);

  const onChange = (event: FilterChangeEvent) => {
    props.onChange({
      query: { ...event.query, selector: ["n", ...event.query.selector] },
    });
  };

  const onClear = (event: FilterClearEvent) => {
    props.onClear({
      selector: ["n", ...event.selector],
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
