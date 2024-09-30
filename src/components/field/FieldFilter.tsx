import { Component, For } from "solid-js";
import { CellValueFilter } from "../../types/configCell";

export const FieldFilter: Component<{ value: CellValueFilter }> = (props) => {
  return (
    <>
      <For each={props.value}>{(id) => <span>{id}</span>}</For>
    </>
  );
};
