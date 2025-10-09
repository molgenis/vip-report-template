import { Component, Show } from "solid-js";
import { ValueString } from "@molgenis/vip-report-vcf";

export const FieldCharacter: Component<{
  value: ValueString | undefined;
}> = (props) => {
  return (
    <Show when={props.value != null}>
      <span>{props.value as string}</span>
    </Show>
  );
};
