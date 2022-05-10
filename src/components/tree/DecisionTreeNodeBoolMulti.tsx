import { Component, For } from "solid-js";
import { BoolMultiNode } from "../../api/DecisionTree";
import { DecisionTreeBoolMultiQuery } from "./DecisionTreeBoolMultiQuery";
import { DecisionTreeOutcomeNode } from "./DecisionTreeOutcomeNode";

export const DecisionTreeNodeBoolMulti: Component<{ node: BoolMultiNode }> = (props) => {
  return (
    <>
      <For each={props.node.outcomes}>
        {(outcome) => (
          <div class="ml-3">
            <DecisionTreeBoolMultiQuery query={outcome} />
          </div>
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
