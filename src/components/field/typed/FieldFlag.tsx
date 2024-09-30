import { Component, Show } from "solid-js";
import { ValueFlag } from "@molgenis/vip-report-vcf";

export const FieldFlag: Component<{
  value: ValueFlag | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <span>{props.value as boolean}</span>
    </Show>
  );
};
