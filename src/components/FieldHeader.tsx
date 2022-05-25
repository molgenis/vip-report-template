import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export const FieldHeader: Component<{
  field: FieldMetadata;
}> = (props) => {
  const label = () => props.field.label || props.field.id;
  return (
    <th>{props.field.description ? <abbr title={props.field.description}>{label()}</abbr> : <span>{label()}</span>}</th>
  );
};
