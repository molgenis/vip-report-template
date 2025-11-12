import { Component, Match, Switch } from "solid-js";
import { VariantTypeId } from "../../../utils/variantType.ts";
import { CellValueGenotype } from "../../../types/configCellComposed";
import { FieldGenotypeSnvSv } from "./FieldGenotypeSnvSv";
import { FieldGenotypeStr } from "./FieldGenotypeStr";
import { ErrorNotification } from "../../ErrorNotification";

export const FieldGenotype: Component<{
  value: CellValueGenotype;
}> = (props) => {
  const variantTypeId = (): VariantTypeId => {
    const value = props.value.svType;

    let variantType: VariantTypeId;
    if (value === null || value === undefined) {
      variantType = "snv";
    } else if (value === "STR") {
      variantType = "str";
    } else {
      variantType = "sv";
    }
    return variantType;
  };

  return (
    <Switch fallback={<ErrorNotification error={`unexpected variant type ${variantTypeId()}`} />}>
      <Match when={variantTypeId() === "all" || variantTypeId() === "snv" || variantTypeId() === "sv"}>
        <FieldGenotypeSnvSv value={props.value} />
      </Match>
      <Match when={variantTypeId() === "str"}>
        <FieldGenotypeStr value={props.value} />
      </Match>
    </Switch>
  );
};
