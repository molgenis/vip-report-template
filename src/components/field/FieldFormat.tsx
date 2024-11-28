import { Component, For } from "solid-js";
import { CellValueFormat } from "../../types/configCells";

export const FieldFormat: Component<{ value: CellValueFormat }> = (props) => {
  return (
    <>
      <For each={props.value}>{(formatKey) => <span>{formatKey}</span>}</For>
    </>
  );
};
