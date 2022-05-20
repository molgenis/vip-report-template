import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FormatFilterChangeEvent, FormatFilterClearEvent } from "./FormatFilters";

export const FormatQualityFilter: Component<{
  fieldMetadata: FieldMetadata;
  sampleId: number;
  onChange: (event: FormatFilterChangeEvent, sampleId: number) => void;
  onClear: (event: FormatFilterClearEvent) => void;
}> = (props) => {
  const onChange = (event: CheckboxEvent) => {
    if (event.checked) {
      props.onChange({ fieldMetadata: props.fieldMetadata, value: 20, operator: ">=" }, props.sampleId);
    } else {
      props.onClear({ fieldMetadata: props.fieldMetadata });
    }
  };

  return (
    <>
      <div class="field">
        <div class="control">
          <Checkbox value="1" label="Read depth >= 20" desc={"Read depth greater or equal to 20"} onChange={onChange} />
        </div>
      </div>
    </>
  );
};
