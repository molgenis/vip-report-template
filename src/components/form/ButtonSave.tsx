import { Component } from "solid-js";

export const ButtonSave: Component<{ title: string; onClick: () => void }> = (props) => {
  return (
    <button class="button is-info" onClick={() => props.onClick()} title={props.title}>
      <span class="icon is-small">
        <i class="fas fa-save" />
      </span>
    </button>
  );
};