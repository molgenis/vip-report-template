import { Component } from "solid-js";

export const AlleleSymbolic: Component<{ value: string }> = (props) => {
  return <span class="base-n">{props.value}</span>;
};
