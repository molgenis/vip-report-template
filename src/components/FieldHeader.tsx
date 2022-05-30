import { Component, createMemo, Show } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { abbreviateHeader } from "../utils/field";

export const FieldHeader: Component<{
  field: FieldMetadata;
  vertical?: boolean;
  rowspan?: number;
  colspan?: number;
}> = (props) => {
  const label = createMemo(() => abbreviateHeader(props.field.label || props.field.id));
  return (
    <th
      style={props.vertical ? { "writing-mode": "vertical-rl" } : undefined}
      rowspan={props.rowspan}
      colspan={props.colspan}
    >
      <Show when={props.field.description && props.field.description !== label()} fallback={<span>{label()}</span>}>
        <abbr title={props.field.description}>{label()}</abbr>
      </Show>
    </th>
  );
};
