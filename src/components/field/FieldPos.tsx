import { Component } from "solid-js";
import { CellValuePos } from "../../types/configCells";

export const FieldPos: Component<{ value: CellValuePos }> = (props) => {
  return <span>{props.value}</span>;
};
