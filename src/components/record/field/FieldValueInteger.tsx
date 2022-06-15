import { Component, Show } from "solid-js";

export const FieldValueInteger: Component<{
  value: number | null | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <span>{props.value as number}</span>
    </Show>
  );
};
