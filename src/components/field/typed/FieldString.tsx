import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { ValueString } from "@molgenis/vip-report-vcf";

export const FieldString: Component<{
  value: ValueString | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <Show when={(props.value as string).length > 20} fallback={<span>{props.value as string}</span>}>
        <Abbr title={props.value as string} value={(props.value as string).substring(0, 20)} />
      </Show>
    </Show>
  );
};
