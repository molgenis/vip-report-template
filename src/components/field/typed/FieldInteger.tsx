import { Component, Show } from "solid-js";
import { ValueInteger } from "@molgenis/vip-report-vcf/src/ValueParser";

export const FieldInteger: Component<{
  value: ValueInteger | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <span>{props.value as number}</span>
    </Show>
  );
};
