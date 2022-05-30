import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";

export const FilterIntegerVim: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) props.onChange({ field: props.field, operator: "==", value: 1 });
    else props.onClear({ field: props.field });
  };

  return (
    <div class="control">
      <Checkbox label="Inheritance: match" onChange={onFilterChange} />
    </div>
  );
};
