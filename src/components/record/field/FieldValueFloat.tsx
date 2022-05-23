import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";

export const FieldValueFloat: Component<{
  value: number | null | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <Show
        when={(props.value as number).toString().length > 6}
        fallback={<span>{(props.value as number).toString()}</span>}
      >
        <Abbr title={(props.value as number).toString()} value={(props.value as number).toFixed(4)}></Abbr>
      </Show>
    </Show>
  );
};
