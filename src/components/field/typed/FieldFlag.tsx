import { Component, Show } from "solid-js";
import { ValueFlag } from "@molgenis/vip-report-vcf";

export const FieldFlag: Component<{
  value: ValueFlag | undefined;
}> = (props) => {
  return (
    <Show when={props.value != null}>
      <span>{(props.value as boolean).toString()}</span>
    </Show>
  );
};
