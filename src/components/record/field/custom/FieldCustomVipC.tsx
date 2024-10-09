import { Component, Show } from "solid-js";
import { ValueArray, ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { ConfigFieldCustomVipC } from "../../../../types/configFieldCustom";
import { getInfoValue } from "../../../../utils/recordUtils";
import { Abbr } from "../../../Abbr";

export const FieldCustomVipC: Component<{ fieldConfig: ConfigFieldCustomVipC; record: Item<Record> }> = (props) => {
  const value = () => getInfoValue(props.record, props.fieldConfig.fieldVipC) as ValueString;
  const description = () =>
    props.fieldConfig.fieldVipP ? (getInfoValue(props.record, props.fieldConfig.fieldVipP) as ValueArray[]) : undefined;

  return (
    <Show when={value()} keyed>
      {(value) => (
        <Show when={description()} fallback={value} keyed>
          {(description) => <Abbr title={description.join(", ")} value={value} />}
        </Show>
      )}
    </Show>
  );
};
