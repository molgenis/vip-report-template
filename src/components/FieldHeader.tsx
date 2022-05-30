import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export const FieldHeader: Component<{
  field: FieldMetadata;
  vertical?: boolean;
  rowspan?: number;
  colspan?: number;
}> = (props) => {
  const label = () => props.field.label || props.field.id;
  return (
    <th
      style={props.vertical ? { "writing-mode": "vertical-rl" } : undefined}
      rowspan={props.rowspan}
      colspan={props.colspan}
    >
      {props.field.description ? <abbr title={props.field.description}>{label()}</abbr> : <span>{label()}</span>}
    </th>
  );
};
