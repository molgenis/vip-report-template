import { Component, Show } from "solid-js";
import { CellValueVipC } from "../../../types/configCellComposed";
import { Abbr } from "../../Abbr";
import { A } from "@solidjs/router";

export const FieldVipC: Component<{
  value: CellValueVipC;
}> = (props) => {
  return (
    <A href={props.value.href || "#"}>
      {/* FIXME see '#'*/}
      <Show when={props.value.vipP} fallback={<span>props.value.vipC</span>} keyed>
        {(vipPItem) => <Abbr title={vipPItem.join(", ")} value={props.value.vipC} />}
      </Show>
    </A>
  );
};
