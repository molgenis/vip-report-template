import { Component } from "solid-js";

export const ButtonReset: Component<{ onClick: () => void }> = (props) => {
  return (
    <button class="button is-small is-ghost" onClick={() => props.onClick()}>
      Reset
    </button>
  );
};
