import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { ValueCategorical } from "../../../utils/vcf.ts";
import { FieldMetadata } from "@molgenis/vip-report-vcf";

export const FieldCategorical: Component<{
  value: ValueCategorical | undefined;
  metadata: FieldMetadata;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <Show when={props.value!.description} fallback={<span>{props.value!.label}</span>}>
        {(description) => <Abbr title={description()} value={props.value!.label} />}
      </Show>
    </Show>
  );
};
