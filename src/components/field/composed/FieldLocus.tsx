import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { FieldChrom } from "../FieldChrom";
import { FieldPos } from "../FieldPos";
import { CellValueLocus } from "../../../types/configCellComposed";

export const FieldLocus: Component<{ value: CellValueLocus }> = (props) => {
  return (
    <A href={props.value.href}>
      <FieldChrom value={props.value.c} />
      <span>:</span>
      <FieldPos value={props.value.p} />
    </A>
  );
};
