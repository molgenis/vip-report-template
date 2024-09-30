import { Component } from "solid-js";
import { CellValueChrom } from "../../types/configCell";

export const FieldChrom: Component<{ value: CellValueChrom }> = (props) => {
  return <span>{props.value}</span>;
};
