import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { getCategoryLabelAndDescription } from "../../../utils/field";
import { FieldMetadata, ValueString } from "@molgenis/vip-report-vcf";

export const FieldCategorical: Component<{
  value: ValueString | undefined;
  metadata: FieldMetadata;
}> = (props) => {
  const valueDescription = () => getCategoryLabelAndDescription(props.metadata, props.value);

  return (
    <Show when={valueDescription().description} fallback={<span>{valueDescription().label}</span>}>
      {(description) => <Abbr title={description()} value={valueDescription().label} />}
    </Show>
  );
};
