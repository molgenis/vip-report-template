import { Component } from "solid-js";

export const ButtonApply: Component<{ onClick: () => void; isEnabled?: () => boolean }> = (props) => {
  return (
    <button
      class="button is-small is-info"
      onClick={() => props.onClick()}
      disabled={props.isEnabled !== undefined && !props.isEnabled()}
    >
      <span class="icon">
        <i class="fas fa-angle-right" />
      </span>
    </button>
  );
};
