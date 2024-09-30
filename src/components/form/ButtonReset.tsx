import { Component } from "solid-js";

export type ButtonFilterResetProps = { onClick: () => void };

export const ButtonReset: Component<ButtonFilterResetProps> = (props) => {
  return (
    <button class="button is-small is-ghost" onClick={() => props.onClick()}>
      Reset
    </button>
  );
};
