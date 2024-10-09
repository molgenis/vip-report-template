import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { FieldMetadata, ValueDescription } from "../../../../../vip-report-vcf/src/MetadataParser";
import { ValueString } from "../../../../../vip-report-vcf/src/ValueParser";

export const FieldValueCategorical: Component<{
  value: ValueString;
  infoMetadata: FieldMetadata;
}> = (props) => {
  const valueDescription = (): ValueDescription | null => {
    if (props.infoMetadata.categories === undefined) throw new Error();

    let valueDescription: ValueDescription | null;
    if (props.value !== null) {
      valueDescription = props.infoMetadata.categories[props.value];
      if (valueDescription === undefined) {
        throw new Error(
          `invalid categorical field '${props.infoMetadata.id}' value '${props.value}' is not one of [${Object.keys(props.infoMetadata.categories).join(", ")}]`,
        );
      }
    } else {
      valueDescription = props.infoMetadata.nullValue || null;
    }
    return valueDescription;
  };

  return (
    <Show when={valueDescription()}>
      {(displayValue) => (
        <Show when={displayValue().description} fallback={<span>{displayValue().label}</span>}>
          {(description) => <Abbr title={description()} value={displayValue().label} />}
        </Show>
      )}
    </Show>
  );
};
