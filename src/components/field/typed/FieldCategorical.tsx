import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { getCategoryLabelAndDescription } from "../../../utils/field";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";

export const FieldCategorical: Component<{
  value: ValueString | undefined;
  metadata: FieldMetadata;
}> = (props) => {
  const valueDescription = () => getCategoryLabelAndDescription(props.value, props.metadata);

  return (
    <Show when={valueDescription().description} fallback={<span>{valueDescription().label}</span>}>
      {(description) => <Abbr title={description()} value={valueDescription().label} />}
    </Show>
  );
};
