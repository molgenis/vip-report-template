import { Component } from "solid-js";

export const ButtonApply: Component<{ onClick: () => void }> = (props) => {
  return (
    <button class="button is-small is-info" onClick={() => props.onClick()}>
      <span class="icon">
        <i class="fas fa-angle-right" />
      </span>
    </button>
  );
};
