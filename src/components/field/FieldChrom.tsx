import { Component } from "solid-js";
import { CellValueChrom } from "../../types/configCells";

export const FieldChrom: Component<{ value: CellValueChrom }> = (props) => {
  return <span>{props.value}</span>;
};
