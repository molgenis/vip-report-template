import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { FieldProps } from "../field/Field";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";

function abbreviate(notation: string): string {
  let abbreviated;
  const tokens = notation.split(":");
  if (tokens.length === 2) {
    abbreviated = tokens[1];
  } else {
    abbreviated = notation;
  }
  return abbreviated.length > 20 ? abbreviated.slice(0, 18) + "\u2026" : abbreviated;
}

export const Hgvs: Component<FieldProps> = (props) => {
  const value = () => props.info.value as ValueString;
  return (
    <Show when={value()} keyed>
      {(value) => <Abbr title={value} value={abbreviate(value)} />}
    </Show>
  );
};
