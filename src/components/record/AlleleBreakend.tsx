import { Component } from "solid-js";

export const AlleleBreakend: Component<{ value: string }> = (props) => {
  return <span class="base-n">{props.value}</span>;
};
