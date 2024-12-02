import { Component, Show } from "solid-js";
import { CellValueVipCS } from "../../../types/configCellComposed";
import { Abbr } from "../../Abbr";

export const FieldVipCS: Component<{
  value: CellValueVipCS;
}> = (props) => {
  return (
    <Show when={props.value.vipCS !== null}>
      <Show when={props.value.vipPS} fallback={<span>{props.value.vipCS!.label}</span>} keyed>
        {(vipPSItem) => <Abbr title={vipPSItem.join(", ")} value={props.value.vipCS!.label!} />}
      </Show>
    </Show>
  );
};
