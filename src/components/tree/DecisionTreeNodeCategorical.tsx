import { Component, For } from "solid-js";
import { CategoricalNode } from "@molgenis/vip-report-api/src/Api";
import { DecisionTreeOutcomeNode } from "./DecisionTreeOutcomeNode";

export const DecisionTreeNodeCategorical: Component<{ node: CategoricalNode }> = (props) => {
  return (
    <>
      <p>field: {props.node.field}</p>
      <For each={Object.entries(props.node.outcomeMap)}>
        {(entry) => (
          <p class="ml-3">
            {entry[0]}: <DecisionTreeOutcomeNode node={entry[1]} />
          </p>
        )}
      </For>
      {props.node.outcomeMissing && (
        <p class="ml-3">
          <span>Missing</span>
          <span class="ml-1 mr-1">{"\u2192"}</span>
          <DecisionTreeOutcomeNode node={props.node.outcomeMissing} />
        </p>
      )}
      {props.node.outcomeDefault && (
        <p class="ml-3">
          <span>Default</span>
          <span class="ml-1 mr-1">{"\u2192"}</span>
          <DecisionTreeOutcomeNode node={props.node.outcomeDefault} />
        </p>
      )}
    </>
  );
};
