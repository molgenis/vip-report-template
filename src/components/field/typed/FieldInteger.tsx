import { Component, Show } from "solid-js";
import { ValueInteger } from "@molgenis/vip-report-vcf";

export const FieldInteger: Component<{
  value: ValueInteger | undefined;
}> = (props) => {
  return (
    <Show when={props.value != null}>
      <span>{props.value as number}</span>
    </Show>
  );
};
