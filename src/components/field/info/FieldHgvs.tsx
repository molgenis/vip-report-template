import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";

function abbreviate(notation: string): string {
  let abbreviated;
  const tokens = notation.split(":");
  if (tokens.length === 2) {
    abbreviated = tokens[1]!;
  } else {
    abbreviated = notation;
  }
  return abbreviated.length > 20 ? abbreviated.slice(0, 18) + "\u2026" : abbreviated;
}

export const FieldHgvs: Component<{ value: ValueString }> = (props) => {
  return (
    <Show when={props.value} keyed>
      {(value) => <Abbr title={value} value={abbreviate(value)} />}
    </Show>
  );
};
