import { Component, For, Show } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { CustomQueries } from "../../store";
import { AllelicBalanceFilter, CustomFilterChangeEvent, CustomFilterClearEvent } from "./AllelicBalanceFilter";

export const CustomFilters: Component<{
  samplesFields: { sample: Item<Sample>; fields: FieldMetadata[] }[];
  queries?: CustomQueries;
  onCustomChange: (event: CustomFilterChangeEvent) => void;
  onCustomClear: (event: CustomFilterClearEvent) => void;
}> = (props) => {
  const onCustomChange = (event: CustomFilterChangeEvent) => props.onCustomChange(event);
  const onCustomClear = (event: CustomFilterClearEvent) => props.onCustomClear(event);
  let showAllelicImbalance = false;
  let gtField: FieldMetadata;
  let adField: FieldMetadata;

  props.samplesFields.forEach((sampleField) => {
    sampleField.fields.forEach((fieldMeta: FieldMetadata) => {
      if (fieldMeta.id === "GT") {
        gtField = fieldMeta;
      } else if (fieldMeta.id === "AD") {
        adField = fieldMeta;
      }
    });
    showAllelicImbalance = adField !== undefined && gtField !== undefined;
  });

  return (
    <>
      <For each={props.samplesFields}>
        {(sampleField) => (
          <Show when={showAllelicImbalance}>
            <AllelicBalanceFilter
              sample={sampleField.sample}
              adField={adField}
              gtField={gtField}
              onChange={onCustomChange}
              onClear={onCustomClear}
            />
          </Show>
        )}
      </For>
    </>
  );
};
