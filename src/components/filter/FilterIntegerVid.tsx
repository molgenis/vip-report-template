import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export const FilterIntegerVid: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValue: Value | undefined;
}> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) props.onChange({ query: { field: props.field, operator: "==", value: 1 } });
    else props.onClear({ field: props.field });
  };

  return (
    <div class="control">
      <Checkbox label="Inheritance: de novo" onChange={onFilterChange} default={props.defaultValue as boolean} />
    </div>
  );
};
