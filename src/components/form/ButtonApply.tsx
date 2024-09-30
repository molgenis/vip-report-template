import { Component } from "solid-js";

export type ButtonApplyProps = { onClick: () => void };

export const ButtonApply: Component<ButtonApplyProps> = (props) => {
  return (
    <button class="button is-small is-info" onClick={() => props.onClick()}>
      <span class="icon">
        <i class="fas fa-angle-right" />
      </span>
    </button>
  );
};
