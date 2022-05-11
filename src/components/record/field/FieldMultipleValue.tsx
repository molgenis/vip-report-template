import { Component, For } from "solid-js";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldSingleValue } from "./FieldSingleValue";

export const FieldMultipleValue: Component<{
  info: Value[];
  infoMetadata: FieldMetadata;
}> = (props) => {
  return (
    <>
      <For each={props.info}>
        {(value, i) => (
          <>
            {i() !== 0 && <span>, </span>}
            <FieldSingleValue info={value} infoMetadata={props.infoMetadata} />
          </>
        )}
      </For>
    </>
  );
};
