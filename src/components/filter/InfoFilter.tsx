import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Filter, FilterChangeEvent, FilterClearEvent } from "./Filter";

export const InfoFilter: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);

  return (
    <>
      <p class="has-text-weight-semibold">
        {props.field.description ? <abbr title={props.field.description}>{label()}</abbr> : <span>{label()}</span>}
      </p>
      <div class="field">
        <Filter field={props.field} onChange={props.onChange} onClear={props.onClear} />
      </div>
    </>
  );
};
