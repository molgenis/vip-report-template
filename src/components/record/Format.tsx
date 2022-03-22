import { Component } from "solid-js";
import { RecordSampleType } from "../../api/vcf/SampleDataParser";

export const Format: Component<{ format: RecordSampleType }> = (props) => {
  return <span>{props.format as string}</span>;
};
