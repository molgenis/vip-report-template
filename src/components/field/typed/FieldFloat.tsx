import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { ValueFloat } from "@molgenis/vip-report-vcf";

export const FieldFloat: Component<{
  value: ValueFloat | undefined;
}> = (props) => {
  return (
    <Show when={props.value != null}>
      <Show
        when={(props.value as number).toString().length > 6}
        fallback={<span>{(props.value as number).toString()}</span>}
      >
        <Abbr title={(props.value as number).toString()} value={(props.value as number).toFixed(4)} />
      </Show>
    </Show>
  );
};
