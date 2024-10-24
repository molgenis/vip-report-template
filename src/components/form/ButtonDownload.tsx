import { Component } from "solid-js";

export const ButtonDownload: Component<{ title: string; onClick: () => void }> = (props) => {
  return (
    <button class="button is-info" onClick={() => props.onClick()} title={props.title}>
      <span class="icon is-small">
        <i class="fas fa-download" />
      </span>
    </button>
  );
};
