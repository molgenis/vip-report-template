import { Component, For } from "solid-js";

export const Filter: Component<{ value: string[] | null }> = (props) => {
  return (
    <>
      <For each={props.value}>{(id) => <span>{id}</span>}</For>
    </>
  );
};
