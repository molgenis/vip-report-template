import { Component, For } from "solid-js";
import { DecisionTree } from "@molgenis/vip-report-api";
import { DecisionTreeNode } from "./DecisionTreeNode";

export type DecisionTreePath = string[];

export const DecisionTreePath: Component<{
  decisionTree: DecisionTree;
  path: DecisionTreePath;
}> = (props) => {
  return (
    <>
      <For each={props.path}>
        {(nodeId, index) => (
          <>
            {index() !== 0 && (
              <div class="has-text-centered">
                <span>{"\u2193"}</span>
              </div>
            )}
            <DecisionTreeNode nodeId={nodeId} node={props.decisionTree.nodes[nodeId]} />
          </>
        )}
      </For>
    </>
  );
};
