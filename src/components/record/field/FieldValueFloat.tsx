import { Component, Show } from "solid-js";

export const FieldValueFloat: Component<{
  value: number | null | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <Show
        when={(props.value as number).toString().length > 6}
        fallback={<span>{(props.value as number).toString()}</span>}
      >
        <abbr title={(props.value as number).toString()}>{(props.value as number).toFixed(4)}</abbr>
      </Show>
    </Show>
  );
};
