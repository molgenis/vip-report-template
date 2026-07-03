import { Component } from "solid-js";
import { CellValueStrNr } from "../../../types/configCellComposed";
import { FieldInteger } from "../typed/FieldInteger";

export const FieldRuNr: Component<{
  value: CellValueStrNr;
}> = (props) => {
  return <FieldInteger value={props.value.ruNr} />;
};
