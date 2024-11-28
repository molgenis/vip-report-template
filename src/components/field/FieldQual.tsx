import { Component } from "solid-js";
import { CellValueQual } from "../../types/configCells";

export const FieldQual: Component<{ value: CellValueQual }> = (props) => {
  return <>{props.value && <span>{props.value}</span>}</>;
};
