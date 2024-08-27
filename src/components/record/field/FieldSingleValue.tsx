import { Component, Match, Switch } from "solid-js";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldValueFloat } from "./FieldValueFloat";
import { FieldValueString } from "./FieldValueString";
import { FieldValueCharacter } from "./FieldValueCharacter";
import { FieldValueInteger } from "./FieldValueInteger";
import { FieldValueFlag } from "./FieldValueFlag";
import { Error } from "../../Error";

export const FieldSingleValue: Component<{
  info: Value;
  infoMetadata: FieldMetadata;
}> = (props) => {
  const type = () => props.infoMetadata.type;
  return (
    <Switch fallback={<Error error={`invalid info type ${type()}`} />}>
      <Match when={type() === "CATEGORICAL" || type() === "STRING" || type() === "RANGE"}>
        <FieldValueString value={props.info as string} />
      </Match>
      <Match when={type() === "CHARACTER"}>
        <FieldValueCharacter value={props.info as string} />
      </Match>
      <Match when={type() === "FLAG"}>
        <FieldValueFlag value={props.info as boolean} />
      </Match>
      <Match when={type() === "FLOAT"}>
        <FieldValueFloat value={props.info as number} />
      </Match>
      <Match when={type() === "INTEGER"}>
        <FieldValueInteger value={props.info as number} />
      </Match>
    </Switch>
  );
};
