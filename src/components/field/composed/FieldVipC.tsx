import { Component, Show } from "solid-js";
import { CellValueVipC } from "../../../types/configCellComposed";
import { Abbr } from "../../Abbr";
import { useNavigate } from "@solidjs/router";

export const FieldVipC: Component<{
  value: CellValueVipC;
}> = (props) => {
  const navigate = useNavigate();

  const onClick = () => {
    if (props.value.href) {
      // use 'navigate' instead of '<A href=' such that cache is used
      navigate(props.value.href);
    }
  };

  return (
    <a onClick={onClick}>
      <Show when={props.value.vipP} fallback={<span>{props.value.vipC!.value}</span>} keyed>
        {(vipPItem) => <Abbr title={vipPItem.join(", ")} value={props.value.vipC!.value!} />}
      </Show>
    </a>
  );
};
