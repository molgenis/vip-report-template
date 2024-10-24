import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FieldChrom } from "../FieldChrom";
import { FieldPos } from "../FieldPos";
import { CellValueLocus } from "../../../types/configCellComposed";

export const FieldLocus: Component<{ value: CellValueLocus }> = (props) => {
  // use 'navigate' instead of '<A href=' such that cache is used
  const navigate = useNavigate();

  return (
    <a onClick={() => navigate(props.value.href)}>
      <FieldChrom value={props.value.c} />
      <span>:</span>
      <FieldPos value={props.value.p} />
    </a>
  );
};
