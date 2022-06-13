import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { selector } from "../../utils/query";

export const FilterIntegerDp: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValue: Value | undefined;
}> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) props.onChange({ query: { selector: selector(props.field), operator: ">=", args: 20 } });
    else props.onClear({ selector: selector(props.field) });
  };

  return (
    <div class="control">
      <Checkbox label="Read depth >= 20" onChange={onFilterChange} default={props.defaultValue as boolean} />
    </div>
  );
};
