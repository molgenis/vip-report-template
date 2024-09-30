import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { FieldTypedItem, FieldValueSingle } from "./FieldTypedItem";

export const FieldTypedMultiple: Component<{
  info: FieldValueSingle[];
  infoMetadata: FieldMetadata;
}> = (props) => {
  return (
    <>
      <For each={props.info}>
        {(value, i) => (
          <>
            {i() !== 0 && <span>, </span>}
            <FieldTypedItem value={value} metadata={props.infoMetadata} />
          </>
        )}
      </For>
    </>
  );
};
