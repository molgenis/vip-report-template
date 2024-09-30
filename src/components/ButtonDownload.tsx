import { Component } from "solid-js";

export type ButtonDownloadProps = { title: string; onClick: () => void };

export const ButtonDownload: Component<ButtonDownloadProps> = (props) => {
  return (
    <button class="button is-info" onClick={() => props.onClick()} title={props.title}>
      <span class="icon is-small">
        <i class="fas fa-download" />
      </span>
    </button>
  );
};
