import { Component, Match, Switch } from "solid-js";
import {
  FieldMetadata,
  ValueCharacter,
  ValueFlag,
  ValueFloat,
  ValueInteger,
  ValueObject,
  ValueString,
} from "@molgenis/vip-report-vcf";
import { FieldFloat } from "./FieldFloat";
import { FieldString } from "./FieldString";
import { FieldCharacter } from "./FieldCharacter";
import { FieldInteger } from "./FieldInteger";
import { FieldFlag } from "./FieldFlag";
import { ErrorNotification } from "../../ErrorNotification";
import { FieldCategorical } from "./FieldCategorical";

export type FieldValueSingle = ValueCharacter | ValueFlag | ValueFloat | ValueInteger | ValueObject | ValueString;

export const FieldTypedItem: Component<{
  value: FieldValueSingle | undefined;
  metadata: FieldMetadata;
}> = (props) => {
  const type = () => props.metadata.type;
  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${type()}`} />}>
      <Match when={type() === "CATEGORICAL"}>
        <FieldCategorical value={props.value as ValueString | undefined} metadata={props.metadata} />
      </Match>
      <Match when={type() === "CHARACTER"}>
        <FieldCharacter value={props.value as ValueString | undefined} />
      </Match>
      <Match when={type() === "FLAG"}>
        <FieldFlag value={props.value as ValueFlag | undefined} />
      </Match>
      <Match when={type() === "FLOAT"}>
        <FieldFloat value={props.value as ValueFloat | undefined} />
      </Match>
      <Match when={type() === "INTEGER"}>
        <FieldInteger value={props.value as ValueInteger | undefined} />
      </Match>
      <Match when={type() === "STRING"}>
        <FieldString value={props.value as ValueString | undefined} />
      </Match>
    </Switch>
  );
};
