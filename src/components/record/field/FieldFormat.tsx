import { Component } from "solid-js";
import { ConfigFieldFormat } from "../../../types/field";
import { RecordSampleType } from "@molgenis/vip-report-vcf/src/SampleDataParser";

export const FieldFormat: Component<{
  fieldConfig: ConfigFieldFormat;
  value: RecordSampleType;
}> = (props) => {
  // FIXME
  return <span>{JSON.stringify(props.value)}</span>;
};
