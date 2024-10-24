import { Component } from "solid-js";
import { Allele } from "../Allele";
import { CellValueRef } from "../../types/configCell";

export const FieldRef: Component<{ value: CellValueRef; isAbbreviate?: boolean }> = (props) => {
  const abbreviate = () => (props.isAbbreviate !== undefined ? props.isAbbreviate : true);
  return <Allele value={props.value} isAbbreviate={abbreviate()} />;
};
