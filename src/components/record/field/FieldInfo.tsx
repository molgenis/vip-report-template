import { Component } from "solid-js";
import { ConfigFieldInfo } from "../../../types/field";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export const FieldInfo: Component<{
  fieldConfig: ConfigFieldInfo;
  value: Value;
}> = (props) => {
  // FIXME
  return <span>{JSON.stringify(props.value)}</span>;
};
