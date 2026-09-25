import { Component } from "solid-js";

type SummaryProps = {
  classification: string;
  summary: string;
};

export const SummaryItem: Component<SummaryProps> = (props) => {
  return (
    <div class="box has-background-light mb-2 p-3">
      <div class="is-flex is-justify-content-space-between is-align-items-start">
        <div>
          <span class="heading is-size-6 mb-1">
            <b>{props.classification}</b>
          </span>
        </div>
      </div>

      <div>{props.summary}</div>
    </div>
  );
};
